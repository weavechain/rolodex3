import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import s from "./ContactsReceivedPage.module.scss";

import Header from "../../../components/Header/Header";
import AppRoutes from "../../../helpers/AppRoutes";
import Footer from "../../../components/Footer/Footer";
import TabsWidget from "../../../components/TabsWidget/TabsWidget";
import InfoCard from "../../../components/InfoCard/InfoCard";
import SortingWidget from "../../../components/SortingWidget/SortingWidget";
import ContactsList from "../../../components/ContactsList/ContactsList";
import RoloSearch from "../../../components/RoloSearch/RoloSearch";
import { loadGivenToMe } from "../../../_redux/actions/contacts";

// Received
export default function ContactsReceivedPage() {
	const dispatch = useDispatch();

	const reduxContacts = useSelector(state => state.contacts);
	const currentUser = useSelector(state => state.user.user);
	const [contacts, setContacts] = useState([]);

	useEffect(() => {
		dispatch(loadGivenToMe(currentUser.id));
	}, []);

	useEffect(() => {
		if (!reduxContacts || !reduxContacts.givenToMe)
			return;
		const receivedData = reduxContacts.givenToMe.map(d => JSON.parse(d.shared_data));
		if (reduxContacts.contacts) {
			receivedData.forEach(recData => {
				reduxContacts.contacts.forEach(contact => {
					if (contact.id === recData.id) {
						recData.directories = contact.directories;
					}
				})
			})
		}
		setContacts(receivedData);
	}, [reduxContacts]);

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
					},
					{
						name: "Received",
						url: `${AppRoutes.contacts}/received`,
						isActive: true,
					},
				]}
			/>

			<div className={s.content}>
				<InfoCard
					title="Sent Information"
					description="Contacts who you have shared information with."
				/>

				<SortingWidget onUpdate={setContacts} members={contacts} />
				<ContactsList contacts={contacts} showNewEntries />
			</div>

			<Footer
				page={AppRoutes.contacts}
				search={<RoloSearch data={contacts} setData={setContacts} />}
			/>
		</div>
	);
}
