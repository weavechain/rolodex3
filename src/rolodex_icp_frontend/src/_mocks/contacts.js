import members from "./members";
import directories from "./directories";
import { DISPLAY_FIELDS } from "../helpers/AppHelper";

// CONTACTS
const allContacts = members.map((m, index) => {
	const names = directories
		.slice(Math.floor(Math.random() * directories.length))
		.map((d) => d.name);

	return {
		...m,
		isContact: true,
		was_seen: index % 2 === 0,
		directories: names,
	};
});

const displayFields = DISPLAY_FIELDS.map((f) => f.key);

// REQUESTS
const requests = allContacts.slice(3, 5).map((c, index) => {
	const requestor = allContacts[index % allContacts.length];

	return {
		...c,
		name: requestor.nickname,
		requestor,
		fields: ["wallet", "name", "email", "phone"],
	};
});

// SENT
const sent = allContacts.slice(3, 6).map((c, index) => {
	const p = allContacts[index % allContacts.length];

	return {
		...c,
		name: p.name,
		has_shared: index % 2 === 0,
		fields: displayFields.slice(0, 4),
	};
});

const contacts = {
	contacts: allContacts,
	requests,
	sent: sent,
	received: allContacts.slice(0, 4),
};

export default contacts;
