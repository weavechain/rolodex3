import { uniqueId } from "lodash";
import moment from "moment";
import JimAvatar from "../assets/images/profiles/JimAvatar.svg";

import profile from "./profile";

const DATETIME_MS_FORMAT = "YYYY-MM-DD";
const dt = moment().add(-30, "days");

const names = [
	"Mattie Hodge",
	"Emilie Larson",
	"Isabell Cherry",
	"Aubree Mckay",
	"Stephen Gray",
	"Jeremiah Cross",
	"Gilberto Roy",
	"Jerome Weeks",
	"Moses Frey",
	"Mackenzie Harvey",
];

const members = names.map((name, index) => {
	return {
		id: uniqueId(),
		...profile,
		nickname: { value: name, displayText: name },
		name: { value: name, displayText: name },
		avatar: { value: JimAvatar },

		isContact: index % 3 === 0,
		date_created: dt
			.clone()
			.add(index + 1, "day")
			.format(DATETIME_MS_FORMAT),
	};
});

export default members;
