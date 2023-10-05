import AppHelper from "../../helpers/AppHelper";
import BlockchainHelper from "../../helpers/BlockchainHelper";
import LOCAL_STORAGE from "../../helpers/localStorage";
import { ActionTypes } from "../constants";
import { setCoreProfile } from "./directories";

const LOGIN_TOKEN = "123123";

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

// ------------------------------------- MAGIC LINK -------------------------------------
export const loadUserFromMagicLink = (token) => (dispatch) => {
	const { CORE_DIRECTORY } = AppHelper.getAppData();

	return new Promise((resolve) => {
		// TODO API:  getting user from backend using magic token
		const user =
			LOGIN_TOKEN === token ? BlockchainHelper.getUserByToken(token) : null;

		if (user) {
			dispatch(loginUser(user));
			dispatch(setCoreProfile(CORE_DIRECTORY, user));
		}

		resolve(user);
	});
};
