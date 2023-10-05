import { isLocalhost } from "./Utils";
import AppConfig from "../AppConfig";
import LOCAL_STORAGE from "./localStorage";
import DEFAULT_DEMO_DATA from "../_mocks/DEFAULT_DEMO_DATA";

const LOGIN_TOKEN = "123123";

// ------------------------------------- PROFILE -------------------------------------
export const DISPLAY_FIELDS = [
	{ key: "directories", name: "Common Directories" },
	{ key: "wallet", name: "Wallet" },
	{ key: "email", name: "Email" },
	{ key: "name", name: "Name" },
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

const getAppData = () => {
	const directories = DEFAULT_DEMO_DATA.directories || [];

	// TODO: For now using LS
	let oldState = LOCAL_STORAGE.loadState() || {};
	const CORE_DIRECTORY = oldState.CORE_DIRECTORY || directories[0];
	const CORE_PROFILE = oldState.CORE_PROFILE;

	return {
		CORE_DIRECTORY,
		CORE_PROFILE,
	};
};

const setAppData = (directory, profile) => {
	let newData = { CORE_DIRECTORY: directory };
	if (profile) newData.CORE_PROFILE = profile;

	// TODO: For now using LS
	let oldState = LOCAL_STORAGE.loadState() || {};
	LOCAL_STORAGE.saveState({
		...(oldState || {}),
		...newData,
	});
};

const hasJoinedDirectory = (directoryId) => {
	let { joinedDirectories } = LOCAL_STORAGE.loadState() || {};
	return joinedDirectories && !!joinedDirectories[directoryId];
};

// ------------------------------------- MAGIC LINK -------------------------------------
const sendMagicLink = (email) => {
	const host = isLocalhost ? "http://localhost:3000" : AppConfig.AppUrl;
	const link = `${host}/#/login/${LOGIN_TOKEN}`;

	return _sendEmail({
		to: email,
		subject: "Join me on RoloDEX!",
		body: encodeURIComponent(link),
	});
};

// ------------------------------------- PRIVATE -------------------------------------
const _sendEmail = ({ to, subject, body }) => {
	return new Promise((resolve) => {
		const url = `mailto:${to}?subject=${subject}&body=${body}`;

		const link = document.createElement("a");
		link.href = url;

		if (document.createEvent) {
			const e = document.createEvent("MouseEvents");
			e.initEvent("click", true, true);
			link.dispatchEvent(e);
		}

		resolve(true);
	});
};

// ------------------------------------- PUBLIC -------------------------------------
const AppHelper = {
	sendMagicLink,
	hasJoinedDirectory,
	getAppData,
	setAppData,
	getNotificationsCount,
	DISPLAY_FIELDS,
};

export default AppHelper;
