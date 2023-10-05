import { ActionTypes } from "../constants/index";

export default function user(
	state = {
		isFetching: false,
		user: null,
	},
	action = ""
) {
	switch (action.type) {
		case ActionTypes.LOGIN_SUCCESS:
			return Object.assign({}, state, {
				user: action.user,
				isAuthenticated: true,
			});
		case ActionTypes.LOGOUT_SUCCESS:
			return Object.assign({}, state, {
				isAuthenticated: false,
			});

		default:
			return state;
	}
}
