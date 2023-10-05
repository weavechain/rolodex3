import { ActionTypes } from "../constants";

import DEFAULT_DEMO_DATA from "../../_mocks/DEFAULT_DEMO_DATA";
import AppHelper from "../../helpers/AppHelper";

export const initDirectories = () => {
	// TODO: using dummy data
	//const coreDirectory = directories[0];
	const { CORE_DIRECTORY, CORE_PROFILE } = AppHelper.getAppData();
	const directories = (DEFAULT_DEMO_DATA.directories || []).map((d) =>
		d.id === CORE_DIRECTORY?.id ? CORE_DIRECTORY : d
	);

	return (dispatch) => {
		dispatch({
			type: ActionTypes.INIT_DIRECTORIES,
			isFetching: false,
			directories,
			directory: CORE_DIRECTORY,
			profile: CORE_PROFILE,
		});
	};
};

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

	AppHelper.setAppData(updatedDirectory, profile);

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

export const addUserToDirectory = (directory, profile) => {
	return (dispatch) => {
		return new Promise((resolve) => {
			// TODO: save to backend

			dispatch({
				type: ActionTypes.SAVE_DIR_PROFILE,
				directory: { ...directory, profile },
			});

			resolve(profile);
		});
	};
};

export const removeUserFromDirectory = (directory) => {
	// TODO: remove after api is implemented
	if (directory.isCoreDirectory) {
		AppHelper.setAppData({ ...directory, profile: null });
	}

	return (dispatch) => {
		return new Promise((resolve) => {
			// TODO: remove from db

			dispatch({
				type: ActionTypes.SAVE_DIR_PROFILE,
				directory: { ...directory, profile: null },
			});

			resolve(true);
		});
	};
};

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
