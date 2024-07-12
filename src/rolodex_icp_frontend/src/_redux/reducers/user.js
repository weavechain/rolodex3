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
				user: assureProfileIsUiFormat(action.user),
				isAuthenticated: true,
			});
		case ActionTypes.LOGOUT_SUCCESS:
			return Object.assign({}, state, {
				isAuthenticated: false,
			});


		case ActionTypes.SET_DIR_PROFILE:
			return Object.assign({}, state, {
				user: assureProfileIsUiFormat(action.user),
				isAuthenticated: true,
			});

		default:
			return state;
	}
}

export const assureProfileIsUiFormat = (profileIn) => {
	// convert DB format to UI format
	const valueShowLookingFor = valueShowToObject(profileIn.lookingFor);
	const birthday = !profileIn.birthday || profileIn.birthday === "undefined"
		? undefined
		: profileIn.birthday.includes('=')
			? valueShowToObject(profileIn.birthday)
			: JSON.parse(profileIn.birthday);
	let profileOut = {
		id: profileIn.userId, // TODO: DB columns: id (which is db entry id), userId, directoryId, nickname, ...
		directoryId: profileIn.directoryId,
		wallet: profileIn.wallet && profileIn.wallet !== "undefined"
			? { value: valueShowToObject(profileIn.wallet), show: profileIn.showWallet ? 'true' : 'false' }
			: undefined,
		email: valueShowToObject(profileIn.email),
		nickname: valueShowToObject(profileIn.nickname),
		firstName: valueShowToObject(profileIn.firstName),
		lastName: valueShowToObject(profileIn.lastName),
		country: valueShowToObject(profileIn.country),
		birthday: birthday,
		lookingFor: valueShowLookingFor && valueShowLookingFor !== "undefined" ? valueShowLookingFor : undefined,
		favorite_sushi: valueShowToObject(profileIn.favorite_sushi),
		city: valueShowToObject(profileIn.city),
		state: valueShowToObject(profileIn.state),
		jobTitle: valueShowToObject(profileIn.jobTitle),
		company: valueShowToObject(profileIn.company),
		phone: valueShowToObject(profileIn.phone),
		linkedin: valueShowToObject(profileIn.linkedin),
		discord: valueShowToObject(profileIn.discord),
		telegram: valueShowToObject(profileIn.telegram),
		twitter: valueShowToObject(profileIn.twitter),
		name: valueShowToObject(profileIn.nickname),
		address: valueShowToObject(profileIn.address_summary),
		joinTs: profileIn.joinTs
	};
	return profileOut;
}

const valueShowToObject = (valueShowString) => {
	if (valueShowString === "undefined")
		return undefined;
	if (valueShowString && valueShowString.startsWith("{\"value\":"))
		return JSON.parse(valueShowString);

	if (!valueShowString || typeof valueShowString !== "string" || !valueShowString.startsWith("{value="))
		return valueShowString;

	return {
		value: valueShowString.split(",")[0].split("=")[1],
		show: valueShowString.split(",")[1].split("=")[1].split("}")[0],
	}
}