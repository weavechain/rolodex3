import { ActionTypes } from "../constants/index";

export default function directories(state = {}, action = "") {
	switch (action.type) {
		case ActionTypes.INIT_DIRECTORIES:
			return Object.assign({}, state, {
				directories: action.directories,
			});

		case ActionTypes.SET_CURRENT_DIRECTORY:
			return Object.assign({}, state, {
				CURRENT_DIRECTORY: action.directory || [],
			});

		case ActionTypes.UPDATE_CORE_PROFILE:
			return Object.assign({}, state, {
				CORE_PROFILE: action.profile,
				CORE_DIRECTORY: action.directory,
				CURRENT_DIRECTORY: action.directory,
				directories: (state.directories || []).map((d) => {
					return d.id === action.directory.id ? action.directory : d;
				}),
			});

		default:
			return state;
	}
}
