import moment from "moment";
import { ActionTypes } from "../constants";

import DEFAULT_DEMO_DATA from "../../_mocks/DEFAULT_DEMO_DATA";

export const initContacts = () => {
	return (dispatch) => {
		dispatch({
			type: ActionTypes.INIT_CONTACTS,
			isFetching: false,
			...(DEFAULT_DEMO_DATA.contacts || {}),
		});
	};
};

export const setCurrentContact = (contact) => {
	return (dispatch) => {
		return new Promise((resolve) => {
			dispatch({
				type: ActionTypes.SET_SELECTED_CONTACT,
				contact,
			});

			resolve(contact);
		});
	};
};

export const respondToRequest = (response) => {
	const dt = moment().format("YYYY-MM-DD");

	return (dispatch) => {
		return new Promise((resolve) => {
			dispatch({
				type: ActionTypes.RESPOND_TO_REQUEST,
				response: {
					...response,
					date_created: dt,
				},
			});

			resolve(response);
		});
	};
};

export const sendNewDataRequest = (request) => {
	return (dispatch) => {
		return new Promise((resolve) => {
			dispatch({
				type: ActionTypes.SEND_REQUEST_INFO,
				request: {
					...request,
					was_seen: false,
					date_created: moment().format("YYYY-MM-DD"),
				},
			});

			resolve(request);
		});
	};
};

export const shareInfoVoluntarily = (data) => {
	return (dispatch) => {
		return new Promise((resolve) => {
			dispatch({
				type: ActionTypes.SHARE_INFO,
				sent: {
					...data,
					was_seen: false,
					date_created: moment().format("YYYY-MM-DD"),
				},
			});

			resolve(data);
		});
	};
};
