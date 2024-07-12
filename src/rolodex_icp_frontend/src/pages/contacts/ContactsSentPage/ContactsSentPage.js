import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";

import s from "./ContactsSentPage.module.scss";

import Header from "../../../components/Header/Header";
import AppRoutes from "../../../helpers/AppRoutes";
import Footer from "../../../components/Footer/Footer";
import TabsWidget from "../../../components/TabsWidget/TabsWidget";
import InfoCard from "../../../components/InfoCard/InfoCard";
import SortingWidget from "../../../components/SortingWidget/SortingWidget";
import ContactsList from "../../../components/ContactsList/ContactsList";
import RoloSearch from "../../../components/RoloSearch/RoloSearch";
import { loadWhatIGave } from "../../../_redux/actions/contacts";

// Sent
export default function ContactsSentPage() {
	const history = useHistory();
	const dispatch = useDispatch();

	const reduxContacts = useSelector(state => state.contacts);
	const currentUser = useSelector(state => state.user.user);

	const [contacts, setContacts] = useState([]);

	useEffect(() => {
		dispatch(loadWhatIGave(currentUser.id));
	}, []);

	useEffect(() => {
		if (!reduxContacts.whatIGave || reduxContacts.whatIGave.len === 0)
			return;

		const requestingUserIds = reduxContacts.whatIGave.map(redReq => redReq.requestorId);
		const requestingContacts = reduxContacts.contacts.filter(c => requestingUserIds.includes(c.id));
		setContacts(requestingContacts);
	}, [reduxContacts]);

	// TODO:
	const has_shared = true;

	// ------------------------------------- METHODS -------------------------------------
	const onContactSelected = (contact) => {
		const path = has_shared
			? `${AppRoutes.contacts}/${contact.id}`
			: AppRoutes.directoryMemberDetails;

		history.push(path);
	};

	return (
		<div className={s.root}>
			<Header title="Contacts" />

			<TabsWidget
				tabs={[
					{ name: "Contacts", url: `${AppRoutes.contacts}` },
					{
						name: "Requests",
						url: `${AppRoutes.contacts}/requests`,
					},
					{
						name: "Sent",
						url: `${AppRoutes.contacts}/sent`,
						isActive: true,
					},
					{
						name: "Received",
						url: `${AppRoutes.contacts}/received`,
					},
				]}
			/>

			<div className={s.content}>
				<InfoCard
					title="Sent Information"
					description="Contacts who you have shared information with."
				/>

				<SortingWidget onUpdate={setContacts} members={contacts} />
				<ContactsList
					contacts={contacts}
					onContactSelected={onContactSelected}
				/>
			</div>

			<Footer
				page={AppRoutes.contacts}
				search={<RoloSearch data={contacts} setData={setContacts} />}
			/>
		</div>
	);
}
