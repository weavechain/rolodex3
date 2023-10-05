import { ActionTypes } from "../constants/index";

export default function contacts(state = {}, action = "") {
	switch (action.type) {
		case ActionTypes.INIT_CONTACTS:
			return Object.assign({}, state, {
				contacts: action.contacts,
				sent: action.sent,
				received: action.received,
				requests: action.requests,
			});

		case ActionTypes.SET_SELECTED_CONTACT:
			return Object.assign({}, state, {
				CURRENT_CONTACT: action.contact || [],
			});

		case ActionTypes.SEND_REQUEST_INFO:
			return Object.assign({}, state, {
				//sent: [...(state.sent || []), action.request], // add to sent
				requests: [...(state.requests || []), action.request], // add to requests
			});

		case ActionTypes.RESPOND_TO_REQUEST:
			return Object.assign({}, state, {
				// remove from requests
				requests: (state.requests || []).filter(
					(r) => r.id !== action.response?.id
				),
			});

		case ActionTypes.SHARE_INFO:
			return Object.assign({}, state, {
				sent: [...(state.sent || []), action.sent], // add to requests
			});

		default:
			return state;
	}
}
