import { isLocalhost } from "./Utils";
import AppConfig from "../AppConfig";
import LOCAL_STORAGE from "./localStorage";
import { generateAndSendMagicLink } from "../_redux/actions/user";

// ------------------------------------- PROFILE -------------------------------------
export const DISPLAY_FIELDS = [
	// { key: "directories", name: "Common Directories" },
	{ key: "wallet", name: "Wallet" },
	{ key: "email", name: "Email" },
	{ key: "name", name: "Name" },
	{ key: "nickname", name: "Nickname" },
	{ key: "birthday", name: "Birthday" },
	{ key: "address", name: "Address" },
	{ key: "phone", name: "Phone" },
	{ key: "company", name: "Company" },
	{ key: "lookingFor", name: "Looking For" },
	{ key: "jobTitle", name: "Job Title" },
	{ key: "linkedin", name: "LinkedIn" },
	{ key: "telegram", name: "Telegram" },
	{ key: "twitter", name: "Twitter" },
	{ key: "discord", name: "Discord" },
	{ key: "favorite_sushi", name: "Favorite Sushi" },
];

// ------------------------------------- DIRECTORIES -------------------------------------
const getNotificationsCount = (contacts = {}) => {
	const { requests = [], received = [] } = contacts;

	const newRequestsCount = requests.filter((r) => !r.was_seen).length;
	const receivedCount = received.filter((r) => !r.was_seen).length;

	return newRequestsCount + receivedCount;
};

const hasJoinedDirectory = (directoryId) => {
	let { joinedDirectories } = LOCAL_STORAGE.loadState() || {};
	return joinedDirectories && !!joinedDirectories[directoryId];
};

// ------------------------------------- MAGIC LINK -------------------------------------
const sendMagicLink = (email) => {
	const host = isLocalhost ? "http://localhost:3000/#/login/" : "https://rolodex.weavechain.com/#/login/";

	return _sendEmail({
		to: email,
		subject: "Join me on RoloDEX!",
		urlHost: host
	});
};

// ------------------------------------- PRIVATE -------------------------------------
const _sendEmail = ({ to, subject, body, urlHost }) => {
	return generateAndSendMagicLink(to, urlHost);
	// return new Promise((resolve) => {
	// 	const url = `mailto:${to}?subject=${subject}&body=${body}`;

	// 	const link = document.createElement("a");
	// 	link.href = url;

	// 	if (document.createEvent) {
	// 		const e = document.createEvent("MouseEvents");
	// 		e.initEvent("click", true, true);
	// 		link.dispatchEvent(e);
	// 	}

	// 	resolve(true);
	// });
};

// ------------------------------------- PUBLIC -------------------------------------
const AppHelper = {
	sendMagicLink,
	hasJoinedDirectory,
	getNotificationsCount,
	DISPLAY_FIELDS,
};

export default AppHelper;
