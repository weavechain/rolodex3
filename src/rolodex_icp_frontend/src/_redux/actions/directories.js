import { ActionTypes } from "../constants";

import WeaveHelper from "../../weaveapi/helper";
import WeaveAPI from "../../weaveapi/weaveapi";
import Records from "../../weaveapi/records";
import { Filter, FilterOp } from "../../weaveapi/filter";
import { stringHashCode } from "../../helpers/Utils";
import AppConfig from "../../AppConfig";

// TODO: where to get keys from?
const pub = "weaved8xLnTMp5B5GtJwDQvc1u7K4fwPc2ry7iDieyCdJRHcG";
const pvk = "3eF1tyUnN3AjrLzmaFPEnk5yr6zbWggLv6884B5G6ak7";

// TODO: are these ok in localStorage? Where should I get them from?
const node = AppConfig.WEV_NODE;
const organization = "icprolodex";
const scope = "rolodex";
const tableUsers = "users";
const tableDirectories = "directories";
const encrypted = node.startsWith("http://");

const cfg = WeaveHelper.getConfig(node, pub, pvk, encrypted)

export const initDirectories = () => {
	return async dispatch => {
		const nodeApi = new WeaveAPI().create(cfg);
		await nodeApi.init();
		const session = await nodeApi.login(organization, pub, scope || "*");

		const readRes = await nodeApi.read(session, scope, tableDirectories, null, WeaveHelper.Options.READ_DEFAULT_NO_CHAIN);

		readRes.data.forEach(dir => dir.id = dir.directory_id);

		dispatch({
			type: ActionTypes.INIT_DIRECTORIES,
			isFetching: false,
			directories: readRes.data,
		});
	};
};

export const getMemberCountByDirectoryId = async (directoryId) => {
	const members = await getMembersByDirectoryId(directoryId);
	return members.length;
}

export const getMembersByDirectoryId = async (directoryId) => {
	const nodeApi = new WeaveAPI().create(cfg);
	await nodeApi.init();
	const session = await nodeApi.login(organization, pub, scope || "*");
	const filterOp = FilterOp.eq("directoryId", Number(directoryId));
	const filter = new Filter(filterOp, null, null, ["userId"], null, null);

	const readResult = await nodeApi.read(session, scope, tableUsers, filter, WeaveHelper.Options.READ_DEFAULT_NO_CHAIN);

	return readResult.data;
}

export const setCurrentDirectory = (directory) => {
	return (dispatch) => {
		return new Promise((resolve) => {
			dispatch({
				type: ActionTypes.SET_CURRENT_DIRECTORY,
				isFetching: false,
				directory,
			});

			resolve(directory);
		});
	};
};

export const setCoreProfile = (directory, profile) => {
	const updatedDirectory = { ...directory, profile };

	return (dispatch) => {
		return new Promise((resolve) => {
			dispatch({
				type: ActionTypes.UPDATE_CORE_PROFILE,
				directory: updatedDirectory,
				profile,
			});

			resolve(profile);
		});
	};
};

export const createUser = (directoryId, profile) => {
	const userId = stringHashCode(JSON.stringify(profile));
	console.log("userId hashcode =  " + userId);
	const userRecords = new Records(tableUsers, [
		[
			undefined,
			userId,
			Number(directoryId),
			JSON.stringify(profile.nickname),
			JSON.stringify(profile.lastName),
			JSON.stringify(profile.firstName),
			JSON.stringify(profile.birthday),
			profile.lookingFor ? JSON.stringify(profile.lookingFor) : undefined,
			JSON.stringify(profile.favorite_sushi),
			JSON.stringify(profile.email),
			JSON.stringify(profile.phone),
			JSON.stringify(profile.country),
			JSON.stringify(profile.state),
			JSON.stringify(profile.city),
			JSON.stringify(profile.jobTitle),
			JSON.stringify(profile.company),
			JSON.stringify(profile.linkedin),
			JSON.stringify(profile.discord),
			JSON.stringify(profile.telegram),
			JSON.stringify(profile.twitter),
			profile.wallet?.value,
			profile.wallet?.show === 'true' || profile.wallet?.show === true ? 1 : 0,
			Date.now()
		]
	]);
	return async dispatch => {
		const nodeApi = new WeaveAPI().create(cfg);
		await nodeApi.init();
		const session = await nodeApi.login(organization, pub, scope || "*");
		await nodeApi.write(session, scope, userRecords, WeaveHelper.Options.WRITE_DEFAULT);
		const persistedUser = await nodeApi.read(session, scope, tableUsers, new Filter(FilterOp.eq("userId", userId)), WeaveHelper.Options.READ_DEFAULT_NO_CHAIN);
		dispatch({
			type: ActionTypes.LOGIN_SUCCESS,
			user: persistedUser.data[0]
		});
		return persistedUser.data[0];
	};
}

export const addUserToDirectory = (directoryId, profile) => {
	return async dispatch => {
		const nodeApi = new WeaveAPI().create(cfg);
		await nodeApi.init();
		const session = await nodeApi.login(organization, pub, scope || "*");
		const userRecords = new Records(tableUsers, [
			[
				undefined,
				profile.id,
				Number(directoryId),
				JSON.stringify(profile.nickname),
				JSON.stringify(profile.lastName),
				JSON.stringify(profile.firstName),
				JSON.stringify(profile.birthday),
				profile.lookingFor ? JSON.stringify(profile.lookingFor) : undefined,
				JSON.stringify(profile.favorite_sushi),
				JSON.stringify(profile.email),
				JSON.stringify(profile.phone),
				JSON.stringify(profile.country),
				JSON.stringify(profile.state),
				JSON.stringify(profile.city),
				JSON.stringify(profile.jobTitle),
				JSON.stringify(profile.company),
				JSON.stringify(profile.linkedin),
				JSON.stringify(profile.discord),
				JSON.stringify(profile.telegram),
				JSON.stringify(profile.twitter),
				profile.wallet?.value,
				profile.wallet?.show === 'true' || profile.wallet?.show === true ? 1 : 0,
				Date.now()
			]
		]);

		await nodeApi.write(session, scope, userRecords, WeaveHelper.Options.WRITE_DEFAULT);
		const filterOp = FilterOp.and(FilterOp.eq("userId", profile.id), FilterOp.eq("directoryId", Number(directoryId)))
		const filter = new Filter(filterOp, { "id": "DESC" }, 1, null, null, null);
		const readRes = await nodeApi.read(session, scope, tableUsers, filter, WeaveHelper.Options.READ_DEFAULT_NO_CHAIN);
		const loadedDbProfile = readRes.data[0];
		if (!loadedDbProfile) {
			return;
		}
		dispatch({
			type: ActionTypes.SET_DIR_PROFILE,
			user: loadedDbProfile,
		});
		return loadedDbProfile;
	};
};

export const removeUserFromDirectory = async (directory, profile) => {
	const filterOp = FilterOp.and(
		FilterOp.eq("userId", profile.user.id),
		FilterOp.eq("directoryId", Number(directory.id)));
	const filter = new Filter(filterOp, null, null, null, null, null);

	const nodeApi = new WeaveAPI().create(cfg);
	await nodeApi.init();
	const session = await nodeApi.login(organization, pub, scope || "*");
	const deleteRes = await nodeApi.delete(session, scope, tableUsers, filter, WeaveHelper.Options.DELETE_DEFAULT);
	return deleteRes;
};

export const getCoreProfileByEthAddress = async (ethAddress) => {
	const nodeApi = new WeaveAPI().create(cfg);
	const filterOp = FilterOp.eq("wallet", ethAddress);
	const filter = new Filter(filterOp, { "id": "DESC" }, 1, null, null, null);
	await nodeApi.init();
	const session = await nodeApi.login(organization, pub, scope || "*");
	const readRes = await nodeApi.read(session, scope, tableUsers, filter, WeaveHelper.Options.READ_DEFAULT_NO_CHAIN);
	return readRes.data ? readRes.data[0] : null;
}

export const getLoggedInDirIds = async (userId) => {
	console.log("Getting logged in dir ids for user with id: " + userId);
	const nodeApi = new WeaveAPI().create(cfg);
	const filter = new Filter(FilterOp.eq("userId", userId), null, null, null, null, null);
	await nodeApi.init();
	const session = await nodeApi.login(organization, pub, scope || "*");
	const readRes = await nodeApi.read(session, scope, tableUsers, filter, WeaveHelper.Options.READ_DEFAULT_NO_CHAIN);
	return readRes.data;
}

export const setUserProfileForDirectory = (userId, directoryId) => {
	return async dispatch => {
		const nodeApi = new WeaveAPI().create(cfg);
		const filterOp = FilterOp.and(FilterOp.eq("userId", userId), FilterOp.eq("directoryId", Number(directoryId)));
		const filter = new Filter(filterOp, { "id": "DESC" }, 1, null, null, null);
		await nodeApi.init();
		const session = await nodeApi.login(organization, pub, scope || "*");
		const readRes = await nodeApi.read(session, scope, tableUsers, filter, WeaveHelper.Options.READ_DEFAULT_NO_CHAIN);
		if (!readRes.data) {
			return null;
		}
		const directoryProfile = readRes.data[0];
		if (!directoryProfile) {
			return;
		}
		dispatch({
			type: ActionTypes.SET_DIR_PROFILE,
			user: directoryProfile,
		});
		return directoryProfile;
	}
}

export const getUserProfileByDirectory = (directoryId) => {
	return (dispatch) => {
		return new Promise((resolve) => {
			dispatch({
				type: ActionTypes.GET_DIR_PROFILE,
			});

			resolve({});
		});
	};
};
