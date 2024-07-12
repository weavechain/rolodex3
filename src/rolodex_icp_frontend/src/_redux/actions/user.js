import { base58_to_binary } from "base58-js";
import AppHelper from "../../helpers/AppHelper";
import LOCAL_STORAGE from "../../helpers/localStorage";
import WeaveHelper from "../../weaveapi/helper";
import WeaveAPI from "../../weaveapi/weaveapi";
import { ActionTypes } from "../constants";
import { Filter, FilterOp } from "../../weaveapi/filter";
import AppRoutes from "../../helpers/AppRoutes";
import AppConfig from "../../AppConfig";

// TODO: where to get keys from?
const pub = "weaved8xLnTMp5B5GtJwDQvc1u7K4fwPc2ry7iDieyCdJRHcG";
const pvk = "3eF1tyUnN3AjrLzmaFPEnk5yr6zbWggLv6884B5G6ak7";

// TODO: are these ok in localStorage? Where should I get them from?
const node = AppConfig.WEV_NODE;
const encrypted = node.startsWith("http://");
const organization = "icprolodex";
const scope = "rolodex";
const tableUsers = "users";

const cfg = WeaveHelper.getConfig(node, pub, pvk, encrypted)

export const loginUser = (user) => {
	return (dispatch) => {
		let oldState = LOCAL_STORAGE.loadState() || {};
		LOCAL_STORAGE.saveState({
			...(oldState || {}),
			user,
		});

		return new Promise((resolve) => {
			dispatch({
				type: ActionTypes.LOGIN_SUCCESS,
				user,
			});

			resolve("success");
		});
	};
};

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

export const generateAndSendMagicLink = async (to) => {
	const nodeApi = new WeaveAPI().create(cfg);
	await nodeApi.init();
	await nodeApi.emailAuth(organization, pub, "localhost:3000/#/login/" + to, to);
}

// ------------------------------------- MAGIC LINK -------------------------------------
export const loadUserFromMagicLink = (urlEmail, urlToken) => {
	return async dispatch => {
		const tokenBase58 = urlToken.split("-")[0];
		const token = new TextDecoder().decode(base58_to_binary(tokenBase58));

		const nodeApi = new WeaveAPI().create(cfg);
		await nodeApi.init();
		const session = await nodeApi.login(organization, null, scope, { email_token: urlToken })

		const filterOp = FilterOp.contains("email", urlEmail);
		const filter = new Filter(filterOp, { "id": "DESC" }, 1, null, null, null);
		await nodeApi.init();
		const readRes = await nodeApi.read(session, scope, tableUsers, filter, WeaveHelper.Options.READ_DEFAULT_NO_CHAIN);

		if (!readRes.data) {
			console.log("No user found");
			return "No user found"
		}
		const user = readRes.data[0];

		dispatch({
			type: ActionTypes.LOGIN_SUCCESS,
			user: user,
		});
		return user;
	}
};
