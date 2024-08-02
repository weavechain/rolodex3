import { ActionTypes } from "../constants";

import WeaveHelper from "../../weaveapi/helper";
import WeaveAPI from "../../weaveapi/weaveapi";
import Records from "../../weaveapi/records";
import { Filter, FilterOp } from "../../weaveapi/filter";
import { stringHashCode } from "../../helpers/Utils";
import AppConfig from "../../AppConfig";
import { assureDirectoryProfileIsUiFormat } from "../reducers/user";

// TODO: where to get keys from?
const pub = "weaved8xLnTMp5B5GtJwDQvc1u7K4fwPc2ry7iDieyCdJRHcG";
const pvk = "3eF1tyUnN3AjrLzmaFPEnk5yr6zbWggLv6884B5G6ak7";

// TODO: are these ok in localStorage? Where should I get them from?
const node = AppConfig.WEV_NODE;
const organization = "icprolodex";
const scope = "rolodex";
const encrypted = node.startsWith("http://");

let table_core_profile = "core_profile";
let table_dir_profile = "directory_profile";

const tableDirectories = "directories";


const cfg = WeaveHelper.getConfig(node, pub, pvk, encrypted)

export const initDirectories = () => {
	return async dispatch => {
		const nodeApi = new WeaveAPI().create(cfg);
		await nodeApi.init();
		const session = await nodeApi.login(organization, pub, scope || "*");

		const readRes = await nodeApi.read(session, scope, tableDirectories, null, WeaveHelper.Options.READ_DEFAULT_NO_CHAIN);

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

	const readResult = await nodeApi.read(session, scope, table_dir_profile, filter, WeaveHelper.Options.READ_DEFAULT_NO_CHAIN);

	if (!readResult.data || readResult.data.length === 0)
		return [];

	let res = readResult.data.map(r => assureDirectoryProfileIsUiFormat(r));

	return res;
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

export const updateCoreProfile = (newCoreProfile) => {
	return async dispatch => {
		const nodeApi = new WeaveAPI().create(cfg);
		await nodeApi.init();
		const session = await nodeApi.login(organization, pub, scope || "*");

		const records = new Records(table_core_profile, [[
			undefined,
			newCoreProfile.reader,
			newCoreProfile.userId,
			newCoreProfile.nickname,
			newCoreProfile.lastName,
			newCoreProfile.firstName,
			newCoreProfile.birthday,
			JSON.stringify(newCoreProfile.lookingFor),
			newCoreProfile.favorite_sushi,
			newCoreProfile.email,
			newCoreProfile.phone,
			newCoreProfile.country,
			newCoreProfile.state,
			newCoreProfile.city,
			newCoreProfile.jobTitle,
			newCoreProfile.company,
			newCoreProfile.linkedin,
			newCoreProfile.discord,
			newCoreProfile.telegram,
			newCoreProfile.twitter,
			newCoreProfile.wallet,
			newCoreProfile.ts,
		]]);

		await nodeApi.write(session, scope, records, WeaveHelper.Options.WRITE_DEFAULT);

		const updatedCoreProfileFromDB = await getCoreProfileByUserId(newCoreProfile.userId);

		dispatch({
			type: ActionTypes.LOAD_CORE_PROFILE,
			coreProfile: updatedCoreProfileFromDB,
		});
	};
}

export const createCoreProfile = (coreProfile) => {
	return async dispatch => {
		const nodeApi = new WeaveAPI().create(cfg);
		await nodeApi.init();
		const session = await nodeApi.login(organization, pub, scope || "*");

		const newUserId = stringHashCode(JSON.stringify(coreProfile) + Date.now());
		const records = new Records(table_core_profile, [[
			undefined,
			coreProfile.reader,
			newUserId,
			coreProfile.nickname,
			coreProfile.lastName,
			coreProfile.firstName,
			coreProfile.birthday,
			JSON.stringify(coreProfile.lookingFor),
			coreProfile.favorite_sushi,
			coreProfile.email,
			coreProfile.phone,
			coreProfile.country,
			coreProfile.state,
			coreProfile.city,
			coreProfile.jobTitle,
			coreProfile.company,
			coreProfile.linkedin,
			coreProfile.discord,
			coreProfile.telegram,
			coreProfile.twitter,
			coreProfile.wallet,
			coreProfile.ts,
		]]);

		await nodeApi.write(session, scope, records, WeaveHelper.Options.WRITE_DEFAULT);

		const updatedCoreProfileFromDB = await getCoreProfileByUserId(newUserId);

		dispatch({
			type: ActionTypes.LOAD_CORE_PROFILE,
			coreProfile: updatedCoreProfileFromDB,
		});

		return updatedCoreProfileFromDB;
	};
}

export const addUserToDirectory = (directoryId, profile) => {
	return async dispatch => {
		const nodeApi = new WeaveAPI().create(cfg);
		await nodeApi.init();
		const session = await nodeApi.login(organization, pub, scope || "*");
		const userRecords = new Records(table_dir_profile, [
			[
				undefined,
				Number(directoryId),
				profile.userId,
				profile.nickname,
				profile.lastName,
				profile.firstName,
				profile.birthday ? JSON.stringify(profile.birthday): undefined,
				profile.lookingFor ? JSON.stringify(profile.lookingFor) : undefined,
				profile.favorite_sushi,
				profile.email,
				profile.phone,
				profile.address,
				profile.jobTitle,
				profile.company,
				profile.linkedin,
				profile.discord,
				profile.telegram,
				profile.twitter,
				profile.wallet,
				Date.now()
			]
		]);

		const writeRes = await nodeApi.write(session, scope, userRecords, WeaveHelper.Options.WRITE_DEFAULT);
		const filterOp = FilterOp.and(FilterOp.eq("userId", profile.userId), FilterOp.eq("directoryId", Number(directoryId)))
		const filter = new Filter(filterOp, { "id": "DESC" }, 1, null, null, null);
		const readRes = await nodeApi.read(session, scope, table_dir_profile, filter, WeaveHelper.Options.READ_DEFAULT_NO_CHAIN);
		const loadedDbProfile = readRes.data[0];
		if (!loadedDbProfile) {
			return;
		}
		dispatch({
			type: ActionTypes.SET_DIR_PROFILE,
			directoryProfile: loadedDbProfile,
		});
		return loadedDbProfile;
	};
};

export const removeUserFromDirectory = async (directory, profile) => {
	const filterOp = FilterOp.and(
		FilterOp.eq("userId", profile.userId),
		FilterOp.eq("directoryId", Number(directory.directoryId)));
	const filter = new Filter(filterOp, null, null, null, null, null);

	const nodeApi = new WeaveAPI().create(cfg);
	await nodeApi.init();
	const session = await nodeApi.login(organization, pub, scope || "*");
	const deleteRes = await nodeApi.delete(session, scope, table_dir_profile, filter, WeaveHelper.Options.DELETE_DEFAULT);
	return deleteRes;
};

export const getCoreProfileByEthAddress = async (ethAddress) => {
	const nodeApi = new WeaveAPI().create(cfg);
	const filterOp = FilterOp.eq("wallet", ethAddress);
	const filter = new Filter(filterOp, { "id": "DESC" }, 1, null, null, null);
	await nodeApi.init();
	const session = await nodeApi.login(organization, pub, scope || "*");
	const readRes = await nodeApi.read(session, scope, table_core_profile, filter, WeaveHelper.Options.READ_DEFAULT_NO_CHAIN);
	return readRes.data ? readRes.data[0] : null;
}

export const getCoreProfileByUserId = async (userId) => {
	const nodeApi = new WeaveAPI().create(cfg);
	await nodeApi.init();
	const session = await nodeApi.login(organization, pub, scope || "*");

	const filter = new Filter(FilterOp.eq("userId", userId), { "id": "DESC" }, 1, null, null, null);
	const readRes = await nodeApi.read(session, scope, table_core_profile, filter, WeaveHelper.Options.READ_DEFAULT_NO_CHAIN);
	return readRes.data ? readRes.data[0] : null;
}

export const getDirsOfUserId = async (userId) => {
	const nodeApi = new WeaveAPI().create(cfg);
	const filter = new Filter(FilterOp.eq("userId", userId), null, null, null, null, null);
	await nodeApi.init();
	const session = await nodeApi.login(organization, pub, scope || "*");
	const readRes = await nodeApi.read(session, scope, table_dir_profile, filter, WeaveHelper.Options.READ_DEFAULT_NO_CHAIN);
	return readRes.data;
}

export const getAvgAge = async (directoryId) => {
	const nodeApi = new WeaveAPI().create(cfg);
	await nodeApi.init();
	const session = await nodeApi.login(organization, pub, scope || "*");

	const avg = await nodeApi.compute(session, "rolodex_avg_age", WeaveHelper.Options.COMPUTE_DEFAULT); 
	return avg?.data?.output?.split('=')[1]?.split('}')[0];
}

export const setUserProfileForDirectory = (userId, directoryId) => {
	return async dispatch => {
		const nodeApi = new WeaveAPI().create(cfg);
		const filterOp = FilterOp.and(FilterOp.eq("userId", userId), FilterOp.eq("directoryId", Number(directoryId)));
		// TODO: postFilterOp to check on active column
		const filter = new Filter(filterOp, { "id": "DESC" }, 1, null, null, null);
		await nodeApi.init();
		const session = await nodeApi.login(organization, pub, scope || "*");
		const readRes = await nodeApi.read(session, scope, table_dir_profile, filter, WeaveHelper.Options.READ_DEFAULT_NO_CHAIN);
		if (!readRes.data) {
			return null;
		}
		const directoryProfile = readRes.data[0];
		if (!directoryProfile) {
			return null;
		}
		dispatch({
			type: ActionTypes.SET_DIR_PROFILE,
			directoryProfile: directoryProfile,
		});
		return directoryProfile;
	}
}
