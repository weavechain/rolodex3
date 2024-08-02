import moment from "moment";
import { ActionTypes } from "../constants";

import WeaveHelper from "../../weaveapi/helper";
import WeaveAPI from "../../weaveapi/weaveapi";
import { Filter, FilterOp } from "../../weaveapi/filter";
import { assureDirectoryProfileIsUiFormat } from "../reducers/user";
import Records from "../../weaveapi/records";
import AppConfig from "../../AppConfig";

// TODO: where to get keys from?
const pub = "weaved8xLnTMp5B5GtJwDQvc1u7K4fwPc2ry7iDieyCdJRHcG";
const pvk = "3eF1tyUnN3AjrLzmaFPEnk5yr6zbWggLv6884B5G6ak7";

// TODO: are these ok in localStorage? Where should I get them from?
const node = AppConfig.WEV_NODE;
const organization = "icprolodex";
const scope = "rolodex";
const tableShareAsk = "share_ask";
const encrypted = node.startsWith("http://");

let table_dir_profile = "directory_profile";
let table_share_ask = "share_ask";
let table_share_give = "share_give";
let table_contact = "contact";

const cfg = WeaveHelper.getConfig(node, pub, pvk, encrypted)

export const loadMembersOfDirectory = async (directoryId) => {
	if (!directoryId)
		return [];

	const nodeApi = new WeaveAPI().create(cfg);
	await nodeApi.init();
	const session = await nodeApi.login(organization, pub, scope || "*");
	// TODO: postFilterOp for active field
	const filter = new Filter(FilterOp.eq("directoryId", Number(directoryId)), null, null, ["userId"], null, null);

	const readRes = await nodeApi.read(session, scope, table_dir_profile, filter, WeaveHelper.Options.READ_DEFAULT_NO_CHAIN);
	return readRes.data ? readRes.data : [];
}

export const loadLatestShare = (giverId, askerId) => {
	return async dispatch => {
		const nodeApi = new WeaveAPI().create(cfg);
		await nodeApi.init();
		const session = await nodeApi.login(organization, pub, scope || "*");

		let filterOp = FilterOp.and(
			FilterOp.eq("askerId", askerId),
			FilterOp.eq("giverId", giverId)
		);
		let filter = new Filter(filterOp, { "id": "DESC" }, 1, null, null, null);

		const readRes = await nodeApi.read(session, scope, table_share_give, filter, WeaveHelper.Options.READ_DEFAULT_NO_CHAIN);

		dispatch({
			type: ActionTypes.SET_LATEST_SHARE,
			latestShare: readRes.data[0]?.given ? JSON.parse(readRes.data[0].given) : null
		});
	};
}

export const getCommonDirectory = async (userId, contactId) => {
	const nodeApi = new WeaveAPI().create(cfg);
	await nodeApi.init();
	const session = await nodeApi.login(organization, pub, scope || "*");

	let filterOp = FilterOp.and(
		FilterOp.eq("userId", userId),
		FilterOp.eq("contactId", contactId)
	);
	let filter = new Filter(filterOp, null, 1, null, null, null);

	let readRes = await nodeApi.read(session, scope, table_contact, filter, WeaveHelper.Options.READ_DEFAULT_NO_CHAIN);
	if (readRes.data && readRes.data.length === 1)
		return readRes.data[0].sourceDir;

	filterOp = FilterOp.and(
		FilterOp.eq("userId", contactId),
		FilterOp.eq("contactId", userId)
	);

	filter = new Filter(filterOp, null, 1, null, null, null);
	readRes = await nodeApi.read(session, scope, table_contact, filter, WeaveHelper.Options.READ_DEFAULT_NO_CHAIN);

	if (!readRes.data || readRes.data.length !== 1)
		return {};

	return readRes.data[0].sourceDir;
}

export const checkIsContact = async (userId, contactId) => {
	const nodeApi = new WeaveAPI().create(cfg);
	await nodeApi.init();
	const session = await nodeApi.login(organization, pub, scope || "*");

	const filterOp = FilterOp.and(
		FilterOp.eq("userId", userId),
		FilterOp.eq("contactId", contactId));
	const filter = new Filter(filterOp, { "id": "DESC" }, 1, null, null, null);
	const readRes = await nodeApi.read(session, scope, table_contact, filter, WeaveHelper.Options.READ_DEFAULT_NO_CHAIN);
	return readRes.data.length === 1;
}

export const addContactToDb = async (userId, contactId, srcDirectoryId) => {
	const nodeApi = new WeaveAPI().create(cfg);
	await nodeApi.init();
	const session = await nodeApi.login(organization, pub, scope || "*");

	const contactRecords = new Records(table_contact, [
		[
			undefined,
			userId,
			contactId,
			srcDirectoryId,
			Date.now()
		]
	]);

	await nodeApi.write(session, scope, contactRecords, WeaveHelper.Options.WRITE_DEFAULT);
}

// TODO: aggregate data from all common directories
export const loadContactsOfProfile = (userId) => {
	return async dispatch => {
		const nodeApi = new WeaveAPI().create(cfg);
		await nodeApi.init();
		const session = await nodeApi.login(organization, pub, scope || "*");

		const filter = new Filter(FilterOp.eq("userId", userId), null, null, null, null, null);
		const contacts = await nodeApi.read(session, scope, table_contact, filter, WeaveHelper.Options.READ_DEFAULT_NO_CHAIN);
		// contacts = {(userId, contactId, sourceDir)}

		let result = [];
		for (let i = 0; i < contacts.data.length; i++) {
			let filterOp = FilterOp.and(
				FilterOp.eq("userId", contacts.data[i].contactId),
				FilterOp.eq("directoryId", contacts.data[i].sourceDir));
			let contactFilter = new Filter(filterOp, null, null, null, null, null);

			let contactDataFromSrcDir = await nodeApi.read(session, scope, table_dir_profile, contactFilter, WeaveHelper.Options.READ_DEFAULT_NO_CHAIN);
			if (contactDataFromSrcDir.data[0])
				result.push(assureDirectoryProfileIsUiFormat(contactDataFromSrcDir.data[0]));
		}

		dispatch({
			type: ActionTypes.SET_AGGREGATED_CONTACTS,
			contacts: result,
		})

		return result;
	}
}
// <id> => <id, sourceDir> => <id, dirProfile>
export const getUnknownContacts = async (ids, userId) => {
	if (!ids || ids.length === 0)
		return [];
	const nodeApi = new WeaveAPI().create(cfg);
	await nodeApi.init();
	const session = await nodeApi.login(organization, pub, scope || "*");

	// get src directories where the unknown contact added userId
	let filterOp = FilterOp.and(
		FilterOp.eq("contactId", userId),
		FilterOp.eq("userId", ids[0]),
	);
	for (let i = 1; i < ids.length; i++) {
		filterOp = FilterOp.or(
			filterOp,
			FilterOp.and(
				FilterOp.eq("contactId", userId),
				FilterOp.eq("userId", ids[i]),
			))
	}
	let filter = new Filter(filterOp, null, null, null, null, null);
	let unknownContacts = await nodeApi.read(session, scope, table_contact, filter, WeaveHelper.Options.READ_DEFAULT_NO_CHAIN);

	if (!unknownContacts.data)
		return [];

	// get unknown contacts' data from sourceDirectories
	filterOp = FilterOp.and(
		FilterOp.eq("directoryId", unknownContacts.data[0].sourceDir),
		FilterOp.eq("userId", Number(unknownContacts.data[0].userId)));
	for (let i = 1; i < unknownContacts.data.length; i++) {
		filterOp = FilterOp.or(
			filterOp,
			FilterOp.and(
				FilterOp.eq("directoryId", unknownContacts.data[i].sourceDir),
				FilterOp.eq("userId", Number(unknownContacts.data[i].userId))
			)
		)
	}
	filter = new Filter(filterOp, null, null, ["userId", "directoryId"], null, null);
	let unknownContactsDirProfiles = await nodeApi.read(session, scope, table_dir_profile, filter, WeaveHelper.Options.READ_DEFAULT_NO_CHAIN);

	if (!unknownContactsDirProfiles.data)
		return [];
	let uiFormatUnknownContactDirProfiles = unknownContactsDirProfiles.data.map(profile => assureDirectoryProfileIsUiFormat(profile));
	return uiFormatUnknownContactDirProfiles;
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

export const setCurrentAsking = (asking) => {
	return async dispatch => {
		dispatch({
			type: ActionTypes.SET_SELECTED_ASKING,
			asking,
		});

		return asking;
	}
}

export const setCurrentGiving = (giving) => {
	return async dispatch => {
		dispatch({
			type: ActionTypes.SET_SELECTED_CONTACT, // TODO: if need to separate in redux from CURRENT_CONTACT -> ActionTypes.SET_SELECTED_GIVING
			contact: giving.giver,
		});

		return giving;
	}
}

export const respondToRequest = (requestorWallet, askerId, currentUserId, requestedFields, given) => {
	const dt = moment().format("YYYY-MM-DD");

	return async dispatch => {
		const nodeApi = new WeaveAPI().create(cfg);
		await nodeApi.init();
		const session = await nodeApi.login(organization, pub, scope || "*");

		// TODO: add was_seen = 1 record for the current ASK
		const updatedAskRecord = new Records(table_share_ask, [
			[
				undefined,
				askerId,
				currentUserId,
				JSON.stringify(requestedFields),
				1,
				Date.now()
			]
		]);
		await nodeApi.write(session, scope, updatedAskRecord, WeaveHelper.Options.WRITE_DEFAULT);

		const shareRecord = new Records(table_share_give, [
			[undefined,
				requestorWallet,
				askerId,
				currentUserId,
				JSON.stringify({ ...given, ts: Date.now() }),
				0,
				Date.now()
			]
		]);
		await nodeApi.write(session, scope, shareRecord, WeaveHelper.Options.WRITE_DEFAULT);

		dispatch({
			type: ActionTypes.RESPOND_TO_REQUEST,
			response: {
				...given,
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

		const requestRecord = new Records(table_share_ask, [
			[undefined,
				request.askerId,
				request.giverId,
				JSON.stringify(request.fields),
				0,
				Date.now()
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

		let filterOp = FilterOp.eq("giverId", myUserId);

		const filter = new Filter(filterOp, { "id": "ASC" }, null, ["asked"], null, null);
		const readRes = await nodeApi.read(session, scope, table_share_ask, filter, WeaveHelper.Options.READ_DEFAULT_NO_CHAIN);

		if (!readRes.data)
			return;

		const askedFromMeNotTreated = readRes.data.filter(x => x.didRespond === 0);

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

		let filterOp = FilterOp.eq("giverId", myUserId);

		const filter = new Filter(filterOp, { "id": "ASC" }, null, null, null, null);
		const readRes = await nodeApi.read(session, scope, table_share_give, filter, WeaveHelper.Options.READ_DEFAULT_NO_CHAIN);

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

		let filterOp = FilterOp.eq("askerId", myUserId);

		const filter = new Filter(filterOp, { "id": "ASC" }, null, null, null, null);
		const readRes = await nodeApi.read(session, scope, table_share_give, filter, WeaveHelper.Options.READ_DEFAULT_NO_CHAIN);

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
			filterOp = FilterOp.and(filterOp, FilterOp.eq("askerId", requestor));
		}
		if (requestee != null && requestee != undefined) {
			filterOp = FilterOp.and(filterOp, FilterOp.eq("giverId", requestee));
		}

		const filter = new Filter(filterOp, null, null, ["askerId", "giverId", "shared_data"], null, null);
		const readRes = await nodeApi.read(session, scope, tableShareAsk, filter, WeaveHelper.Options.READ_DEFAULT_NO_CHAIN);

		dispatch({
			type: ActionTypes.LOAD_SHARING,
			sharing: readRes.data
		});
		return readRes.data;
	}
}

export const shareInfoVoluntarily = (askerId, giverId, requestorWallet, data) => {
	const dt = moment().format("YYYY-MM-DD");
	return async dispatch => {

		const nodeApi = new WeaveAPI().create(cfg);
		await nodeApi.init();
		const session = await nodeApi.login(organization, pub, scope || "*");

		const shareRecord = new Records(table_share_give, [
			[
				undefined,
				requestorWallet,
				askerId,
				giverId,
				JSON.stringify({ ...data, ts: Date.now() }),
				0,
				Date.now()
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
