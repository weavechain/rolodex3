import { base58_to_binary } from "base58-js";
import LOCAL_STORAGE from "../../helpers/localStorage";
import WeaveHelper from "../../weaveapi/helper";
import WeaveAPI from "../../weaveapi/weaveapi";
import { ActionTypes } from "../constants";
import { Filter, FilterOp } from "../../weaveapi/filter";
import AppConfig from "../../AppConfig";
import { assureCoreProfileIsUiFormat } from "../reducers/user";

// TODO: where to get keys from?
const pub = "weaved8xLnTMp5B5GtJwDQvc1u7K4fwPc2ry7iDieyCdJRHcG";
const pvk = "3eF1tyUnN3AjrLzmaFPEnk5yr6zbWggLv6884B5G6ak7";

// TODO: are these ok in localStorage? Where should I get them from?
const node = AppConfig.WEV_NODE;
const encrypted = node.startsWith("http://");
const organization = "icprolodex";
const scope = "rolodex";
let table_core_profile = "core_profile";
let table_dir_profile = "directory_profile";

const cfg = WeaveHelper.getConfig(node, pub, pvk, encrypted)

export const logoutUser = () => {
	return (dispatch) => {
		return new Promise((resolve) => {
			LOCAL_STORAGE.saveState({});

			dispatch({
				type: ActionTypes.LOGOUT_SUCCESS,
				isFetching: false,
				isAuthenticated: false,
			});
			resolve("success");
		});
	};
};

export const generateAndSendMagicLink = async (to, urlHost) => {
	const nodeApi = new WeaveAPI().create(cfg);
	await nodeApi.init();
	await nodeApi.emailAuth(organization, pub, urlHost + to, to);
}

export const getDirectoryProfile = async (dirId, userId) => {
	const nodeApi = new WeaveAPI().create(cfg);
	await nodeApi.init();
	const session = await nodeApi.login(organization, pub, scope || "*");

	let filterOp = FilterOp.and(
		FilterOp.eq("directoryId", dirId),
		FilterOp.eq("userId", userId)
	);
	let filter = new Filter(filterOp, null, 1, null, null, null);

	let readRes = await nodeApi.read(session, scope, table_dir_profile, filter, WeaveHelper.Options.READ_DEFAULT_NO_CHAIN);

	if (!readRes.data || !readRes.data.length === 1)
		return null;
	return assureCoreProfileIsUiFormat(readRes.data[0]);
}

// ------------------------------------- MAGIC LINK -------------------------------------
export const loadUserFromMagicLink = (urlEmail, urlToken) => {
	return async dispatch => {
		const nodeApi = new WeaveAPI().create(cfg);
		await nodeApi.init();
		const session = await nodeApi.login(organization, null, scope, { email_token: urlToken })

		const filterOp = FilterOp.eq("email", urlEmail);
		const filter = new Filter(filterOp, { "id": "DESC" }, 1, null, null, null);
		await nodeApi.init();
		const readRes = await nodeApi.read(session, scope, table_core_profile, filter, WeaveHelper.Options.READ_DEFAULT_NO_CHAIN);

		if (!readRes.data) {
			console.log("No user found");
			return "No user found"
		}
		const coreProfile = readRes.data[0];

		dispatch({
			type: ActionTypes.LOAD_CORE_PROFILE,
			coreProfile: coreProfile,
		});
		return coreProfile;
	}
};
