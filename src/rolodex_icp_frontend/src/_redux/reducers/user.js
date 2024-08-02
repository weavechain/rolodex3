import { ActionTypes } from "../constants/index";

export default function user(
	state = {
		isFetching: false,
		user: null,
	},
	action = ""
) {
	switch (action.type) {
		// TODO: LOGIN_SUCCESS could disappear altogether?
		case ActionTypes.LOGIN_SUCCESS:
			return Object.assign({}, state, {
				coreProfile: assureDirectoryProfileIsUiFormat(action.coreProfile),
				isAuthenticated: true,
			});

		case ActionTypes.LOAD_CORE_PROFILE:
			return Object.assign({}, state, {
				coreProfile: assureCoreProfileIsUiFormat(action.coreProfile),
				isAuthenticated: true,
			});

		case ActionTypes.SET_CORE_PROFILE_BUILDER:
			return Object.assign({}, state, {
				coreProfileBuilder: action.coreProfileBuilder,
			});

		case ActionTypes.LOGOUT_SUCCESS:
			return Object.assign({}, state, {
				isAuthenticated: false,
			});


		case ActionTypes.SET_DIR_PROFILE:
			return Object.assign({}, state, {
				directoryProfile: assureDirectoryProfileIsUiFormat(action.directoryProfile),
				isAuthenticated: true,
			});

		default:
			return state;
	}
}

export const assureDirectoryProfileIsUiFormat = (profileIn) => {
	let lookingFor = profileIn.lookingFor
		? JSON.parse(profileIn.lookingFor)
		: undefined;
	profileIn.lookingFor = lookingFor;

	let birthday = profileIn.birthday
		? JSON.parse(profileIn.birthday)
		: undefined;
	profileIn.birthday = birthday;
	return profileIn;
}

export const assureCoreProfileIsUiFormat = (profileIn) => {
	let lookingFor = profileIn.lookingFor
		? JSON.parse(profileIn.lookingFor)
		: undefined;
	profileIn.lookingFor = lookingFor;

	return profileIn;
}
