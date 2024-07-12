import moment from "moment";
import { ActionTypes } from "../constants";

import WeaveHelper from "../../weaveapi/helper";
import WeaveAPI from "../../weaveapi/weaveapi";
import { Filter, FilterOp } from "../../weaveapi/filter";
import { assureProfileIsUiFormat } from "../reducers/user";
import Records from "../../weaveapi/records";
import AppConfig from "../../AppConfig";

// TODO: where to get keys from?
const pub = "weaved8xLnTMp5B5GtJwDQvc1u7K4fwPc2ry7iDieyCdJRHcG";
const pvk = "3eF1tyUnN3AjrLzmaFPEnk5yr6zbWggLv6884B5G6ak7";

// TODO: are these ok in localStorage? Where should I get them from?
const node = AppConfig.WEV_NODE;
const organization = "icprolodex";
const scope = "rolodex";
const tableUsers = "users";
const tableShareAsk = "share_ask";
const tableShareGive = "share_give";
const encrypted = node.startsWith("http://");

const cfg = WeaveHelper.getConfig(node, pub, pvk, encrypted)

export const loadMembersOfDirectory = async (directoryId) => {
	if (!directoryId)
		return [];

	const nodeApi = new WeaveAPI().create(cfg);
	await nodeApi.init();
	const session = await nodeApi.login(organization, pub, scope || "*");
	const filter = new Filter(FilterOp.eq("directoryId", Number(directoryId)), null, null, ["userId"], null, null);

	const readRes = await nodeApi.read(session, scope, tableUsers, filter, WeaveHelper.Options.READ_DEFAULT_NO_CHAIN);
	return readRes.data ? readRes.data : [];
}

export const loadLatestShare = (requesteeId, requestorId) => {
	return async dispatch => {
		const nodeApi = new WeaveAPI().create(cfg);
		await nodeApi.init();
		const session = await nodeApi.login(organization, pub, scope || "*");

		let filterOp = FilterOp.and(
			FilterOp.eq("requestorId", requestorId),
			FilterOp.eq("requesteeId", requesteeId)
		);
		let filter = new Filter(filterOp, { "id": "DESC" }, 1, null, null, null);

		const readRes = await nodeApi.read(session, scope, tableShareGive, filter, WeaveHelper.Options.READ_DEFAULT_NO_CHAIN);

		dispatch({
			type: ActionTypes.SET_LATEST_SHARE,
			latestShare: readRes.data[0]?.shared_data ? JSON.parse(readRes.data[0].shared_data) : {}
		});
	};
}

export const loadContactsOfProfile = (profile, allDirectories) => {
	return async dispatch => {
		const nodeApi = new WeaveAPI().create(cfg);
		await nodeApi.init();
		const session = await nodeApi.login(organization, pub, scope || "*");

		// read all distinct directoryIds of userId
		const filterProfileDistinctDirIds = new Filter(FilterOp.eq("userId", profile.user.id), { "id": "DESC" }, null, ["directoryId"], ["directoryId"], null);
		const readRes = await nodeApi.read(session, scope, tableUsers, filterProfileDistinctDirIds, WeaveHelper.Options.READ_DEFAULT_NO_CHAIN);
		const dirIds = readRes.data.map(dir => dir["directoryId"]);

		console.log("group ids of profile: " + JSON.stringify(dirIds));

		if (dirIds.length === 0) {
			console.log("Current profile isn't part of any directory. Returning...");
			return;
		}

		// read all profiles from all dirIds
		let allDirectoryIdsFilterOp = FilterOp.eq("directoryId", dirIds[0]);
		for (let i = 1; i < dirIds.length; i++) {
			allDirectoryIdsFilterOp = FilterOp.or(allDirectoryIdsFilterOp, FilterOp.eq("directoryId", dirIds[i]));
		}
		allDirectoryIdsFilterOp = FilterOp.and(allDirectoryIdsFilterOp, FilterOp.neq("userId", profile.user.id));
		const filterAllContactsFromDirIds = new Filter(allDirectoryIdsFilterOp, { "id": "DESC" }, null, null, null, null);
		const allContactsFromDirIds = await nodeApi.read(session, scope, tableUsers, filterAllContactsFromDirIds, WeaveHelper.Options.READ_DEFAULT_NO_CHAIN);

		// computing union of all data
		let userIdToDirProfiles = {};
		for (let i = 0; i < allContactsFromDirIds.data.length; i++) {
			let uiFormatProfile = assureProfileIsUiFormat(allContactsFromDirIds.data[i])
			let list = userIdToDirProfiles[uiFormatProfile.id];
			if (!list) {
				list = [];
			}
			list.push(uiFormatProfile);
			userIdToDirProfiles[uiFormatProfile.id] = list;
		}

		let aggregateProfiles = [];
		for (const [userId, profilesList] of Object.entries(userIdToDirProfiles)) {
			let aggregate = profilesList[0];
			aggregate["directoryIds"] = [profilesList[0].directoryId];
			for (let i = 1; i < profilesList.length; i++) {
				for (const [propKey, propVal] of Object.entries(profilesList[i])) {
					if (propVal && propVal.show && (propVal.show === "true" || propVal.show === true)) {
						aggregate[propKey] = propVal;
					}
				}
				aggregate["directoryIds"].push(profilesList[i].directoryId);
			}
			if (!aggregate["nickname"]) {
				aggregate["nickname"] = { value: aggregate["firstName"].value, show: "true" };
			}
			aggregateProfiles.push(aggregate);
			aggregate["directories"] = aggregate["directoryIds"].map(dirId => allDirectories.filter(dir => Number(dirId) === Number(dir.id)).map(dir => dir.name));
		}

		dispatch({
			type: ActionTypes.SET_AGGREGATED_CONTACTS,
			contacts: aggregateProfiles,
		});
	};
}

export const setCurrentContact = (contact) => {
	return (dispatch) => {
		return new Promise((resolve) => {
			dispatch({
				type: ActionTypes.SET_SELECTED_CONTACT,
				contact,
			});

			resolve(contact);
		});
	};
};

export const respondToRequest = (requestorWallet, requestorId, currentUserId, requestedFields, updatedProfile) => {
	const dt = moment().format("YYYY-MM-DD");

	return async dispatch => {
		const nodeApi = new WeaveAPI().create(cfg);
		await nodeApi.init();
		const session = await nodeApi.login(organization, pub, scope || "*");

		const showFilter = field => updatedProfile[field]?.show === true || updatedProfile[field]?.show === 'true';
		let res = {};
		requestedFields.forEach(field => {
			if (!showFilter(field)) {
				res[field] = "";
			} else {
				res[field] = updatedProfile[field].value;
			}
		});

		// TODO: add was_seen = 1 record for the current ASK
		const updatedAskRecord = new Records(tableShareAsk, [
			[
				undefined,
				requestorId,
				currentUserId,
				JSON.stringify(requestedFields),
				1
			]
		]);
		await nodeApi.write(session, scope, updatedAskRecord, WeaveHelper.Options.WRITE_DEFAULT);

		const shareRecord = new Records(tableShareGive, [
			[undefined,
				requestorId,
				currentUserId,
				JSON.stringify(updatedProfile),
				requestorWallet.value,
				0
			]
		]);
		await nodeApi.write(session, scope, shareRecord, WeaveHelper.Options.WRITE_DEFAULT);

		dispatch({
			type: ActionTypes.RESPOND_TO_REQUEST,
			response: {
				...updatedProfile,
				date_created: dt,
			},
		});

	};
};

export const sendNewDataRequest = (request) => {
	return async (dispatch) => {
		const nodeApi = new WeaveAPI().create(cfg);
		await nodeApi.init();
		const session = await nodeApi.login(organization, pub, scope || "*");

		const requestRecord = new Records(tableShareAsk, [
			[undefined,
				request.requestorId,
				request.requesteeId,
				JSON.stringify(request.fields),
				0
			]
		]);

		const writeRes = await nodeApi.write(session, scope, requestRecord, WeaveHelper.Options.WRITE_DEFAULT);

		dispatch({
			type: ActionTypes.SEND_REQUEST_INFO,
			request: {
				...request,
				was_seen: false,
				date_created: moment().format("YYYY-MM-DD"),
			},
		});
	};
};

export const loadAskedFromMe = (myUserId) => {
	return async dispatch => {
		const nodeApi = new WeaveAPI().create(cfg);
		await nodeApi.init();
		const session = await nodeApi.login(organization, pub, scope || "*");

		let filterOp = FilterOp.eq("requesteeId", myUserId);

		const filter = new Filter(filterOp, { "id": "ASC" }, null, ["requested_data"], null, null);
		const readRes = await nodeApi.read(session, scope, tableShareAsk, filter, WeaveHelper.Options.READ_DEFAULT_NO_CHAIN);

		if (!readRes.data)
			return;

		const askedFromMeNotTreated = readRes.data.filter(x => x.was_treated === 0);

		dispatch({
			type: ActionTypes.SET_ASKED_FROM_ME,
			askedFromMe: askedFromMeNotTreated
		});
	}
}

export const loadWhatIGave = (myUserId) => {
	return async dispatch => {
		const nodeApi = new WeaveAPI().create(cfg);
		await nodeApi.init();
		const session = await nodeApi.login(organization, pub, scope || "*");

		let filterOp = FilterOp.eq("requesteeId", myUserId);

		const filter = new Filter(filterOp, { "id": "ASC" }, null, null, null, null);
		const readRes = await nodeApi.read(session, scope, tableShareGive, filter, WeaveHelper.Options.READ_DEFAULT_NO_CHAIN);

		if (!readRes.data)
			return;

		dispatch({
			type: ActionTypes.SET_WHAT_I_GAVE,
			whatIGave: readRes.data
		});
	};
}

export const loadGivenToMe = (myUserId) => {
	return async dispatch => {
		const nodeApi = new WeaveAPI().create(cfg);
		await nodeApi.init();
		const session = await nodeApi.login(organization, pub, scope || "*");

		let filterOp = FilterOp.eq("requestorId", myUserId);

		const filter = new Filter(filterOp, { "id": "ASC" }, null, ["shared_data"], null, null);
		const readRes = await nodeApi.read(session, scope, tableShareGive, filter, WeaveHelper.Options.READ_DEFAULT_NO_CHAIN);

		if (!readRes.data)
			return;

		dispatch({
			type: ActionTypes.SET_GIVEN_TO_ME,
			givenToMe: readRes.data
		});
	}
}

export const loadShare = (requestor, requestee, askOrGive) => {
	return async dispatch => {
		const nodeApi = new WeaveAPI().create(cfg);
		await nodeApi.init();
		const session = await nodeApi.login(organization, pub, scope || "*");

		let filterOp;
		if (askOrGive === "ask") {
			filterOp = FilterOp.eq("targetEth", null);
		} else if (askOrGive === "give") {
			filterOp = FilterOp.neq("targetEth", null);
		} else {
			console.log("Impossible, askOrGive=" + askOrGive);
			return;
		}

		if (requestor != null && requestor != undefined) {
			filterOp = FilterOp.and(filterOp, FilterOp.eq("requestorId", requestor));
		}
		if (requestee != null && requestee != undefined) {
			filterOp = FilterOp.and(filterOp, FilterOp.eq("requesteeId", requestee));
		}

		const filter = new Filter(filterOp, null, null, ["requestorId", "requesteeId", "shared_data"], null, null);
		const readRes = await nodeApi.read(session, scope, tableShareAsk, filter, WeaveHelper.Options.READ_DEFAULT_NO_CHAIN);

		dispatch({
			type: ActionTypes.LOAD_SHARING,
			sharing: readRes.data
		});
		return readRes.data;
	}
}

export const shareInfoVoluntarily = (requestorId, requesteeId, requestorWallet, data) => {
	const dt = moment().format("YYYY-MM-DD");
	return async dispatch => {

		const nodeApi = new WeaveAPI().create(cfg);
		await nodeApi.init();
		const session = await nodeApi.login(organization, pub, scope || "*");

		const shareRecord = new Records(tableShareGive, [
			[
				undefined,
				requestorId,
				requesteeId,
				JSON.stringify(data),
				requestorWallet,
				0
			]
		]);

		await nodeApi.write(session, scope, shareRecord, WeaveHelper.Options.WRITE_DEFAULT);

		dispatch({
			type: ActionTypes.SHARE_INFO,
			sent: {
				...data,
				was_seen: false,
				date_created: moment().format("YYYY-MM-DD"),
			},
		});

	};
};
