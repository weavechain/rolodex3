import { escapeRegExp } from "lodash";
import moment from "moment";

import { isMobile, getUA } from "react-device-detect";

export const DATE_FORMAT = "YYYY/MM/DD";
export const DATETIME_FORMAT = "YYYY-MM-DD hh:mm:ss";
export const DATETIME_MS_FORMAT = "YYYY-MM-DD hh:mm:ss ms";

export const showMetamaskLogin = isMobile
	? getUA.indexOf("MetaMaskMobile") > -1
	: true;

export const isLocalhost = Boolean(
	window.location.hostname === "localhost" ||
	window.location.hostname === "[::1]" ||
	window.location.hostname.match(
		/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
	)
);

export const hasItems = (list) => {
	return list && list.length > 0;
};

export const generateKey = () => {
	const length = 16;
	const charset =
		"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	let result = "";

	for (let i = 0, n = charset.length; i < length; ++i) {
		result += charset.charAt(Math.floor(Math.random() * n));
	}
	return result;
};

export const pluralize = (text, itemsCount, skipNumber = false) => {
	if (!text) return itemsCount;

	return skipNumber
		? `${itemsCount * 1 === 1 ? text : text + "s"}`
		: `${itemsCount} ${itemsCount * 1 === 1 ? text : text + "s"}`;
};

export const getKeyByValue = (object, value) => {
	for (let prop in object) {
		if (object.hasOwnProperty(prop)) {
			if (object[prop] === value) return prop;
		}
	}
};

export const getSearchPattern = (term) => {
	return new RegExp(escapeRegExp(term).split(" ").join("|"), "gi");
};

export const downloadFile = ({ data, fileName, fileType }) => {
	const blob = new Blob([data], { type: fileType });
	const a = document.createElement("a");
	a.download = fileName;
	a.href = window.URL.createObjectURL(blob);
	const clickEvt = new MouseEvent("click", {
		view: window,
		bubbles: true,
		cancelable: true,
	});
	a.dispatchEvent(clickEvt);
	a.remove();
};

export const now = () => {
	return moment().format(DATETIME_FORMAT);
};

export const getUserTimezone = () => {
	const tz = new Date()
		.toLocaleTimeString("en-us", { timeZoneName: "short" })
		.split(" ")[2];

	return tz ? "(" + tz.replace(/[^a-z]+/gi, "") + ")" : null;
};

export const formatBytes = (bytes, decimals = 2) => {
	if (!+bytes) return "0 Bytes";

	const k = 1024;
	const dm = decimals < 0 ? 0 : decimals;
	const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

// ------------------------------------- PROFILE -------------------------------------
export const getProfileInfo = (data, key, empty = "") => {
	if (!data || !data[key]) {
		return empty;
	}
	if (data[key].value) {
		return data[key].value;
	}
	return data[key];
};

// ------------------------------------- FOR DUMMY DATA -------------------------------------
export const randomBoolFlag = () => {
	return Math.round(Math.random() * 10) % 2 === 0;
};

export const getListNameForAccount = (account) => {
	if (account.nickname) {
		if (account.nickname.value) {
			return account.nickname.value;
		}
		return account.nickname;
	}

	let name = "";
	if (account.firstName.value)
		name = name + account.firstName.value + " ";
	if (account.lastName.value)
		name = name + account.lastName.value;
	return name === "" ? "noname" : name;
};

export const stringHashCode = (str) => {
	var hash = 0, i, chr;
	if (str.length === 0) return hash;
	for (i = 0; i < str.length; i++) {
		chr = str.charCodeAt(i);
		hash = ((hash << 5) - hash) + chr;
		hash |= 0; // Convert to 32bit integer
	}
	return hash;
}

// ------------------------------------- MEDIA -------------------------------------

const Utils = {
	DATE_FORMAT,
	DATETIME_FORMAT,
	downloadFile,
	generateKey,
	getKeyByValue,
	hasItems,
	now,
	pluralize,
	randomBoolFlag,
	stringHashCode,
	getProfileInfo,
	showMetamaskLogin,
};

export default Utils;
