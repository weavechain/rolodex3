import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import s from "./ContactsPage.module.scss";

import AppRoutes from "../../helpers/AppRoutes";
import ContactsList from "../../components/ContactsList/ContactsList";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import InfoCard from "../../components/InfoCard/InfoCard";
import SortingWidget from "../../components/SortingWidget/SortingWidget";
import TabsWidget from "../../components/TabsWidget/TabsWidget";
import RoloSearch from "../../components/RoloSearch/RoloSearch";
import { loadContactsOfProfile } from "../../_redux/actions/contacts";

export default function ContactsPage() {
	const dispatch = useDispatch();
	const reduxContacts = useSelector(state => state.contacts);
	const directories = useSelector(state => state.directories).directories;
	const [contacts, setContacts] = useState([]);
	const coreProfile = useSelector(state => state.user.coreProfile);

	useEffect(() => {
		dispatch(loadContactsOfProfile(coreProfile.userId, directories));
	}, []);

	useEffect(() => {
		setContacts(reduxContacts.contacts);
	}, [reduxContacts]);

	return (
		<div className={s.root}>
			<Header title="Contacts" />

			<TabsWidget
				tabs={[
					{ name: "Contacts", url: "", isActive: true },
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
					},
				]}
			/>

			<div className={s.content}>
				<InfoCard
					title="Contacts"
					description="These are contacts you've shared info with and who have shared info back!"
				/>

				<SortingWidget onUpdate={setContacts} members={contacts} />
				<ContactsList contacts={contacts} />
			</div>

			<Footer
				page={AppRoutes.contacts}
				search={<RoloSearch data={contacts} setData={setContacts} />}
			/>
		</div>
	);
}
