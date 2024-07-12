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

		case ActionTypes.SET_AGGREGATED_CONTACTS:
			return Object.assign({}, state, {
				contacts: action.contacts,
			});

		case ActionTypes.SET_ASKED_FROM_ME:
			return Object.assign({}, state, {
				askedFromMe: action.askedFromMe,
			});

		case ActionTypes.SET_GIVEN_TO_ME:
			return Object.assign({}, state, {
				givenToMe: action.givenToMe,
			});

		case ActionTypes.SET_WHAT_I_GAVE:
			return Object.assign({}, state, {
				whatIGave: action.whatIGave,
			});

		case ActionTypes.SET_LATEST_SHARE:
			return Object.assign({}, state, {
				latestShare: action.latestShare,
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

		case ActionTypes.LOAD_SHARE_REQUESTS:
			return Object.assign({}, state, {
				requests: action.requests
			})

		case ActionTypes.LOAD_SHARING:
			return Object.assign({}, state, {
				sharing: action.sharing
			})


		case ActionTypes.LOAD_SENT_REQUESTS:
			return Object.assign({}, state, {
				requests: action.requests
			})

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
