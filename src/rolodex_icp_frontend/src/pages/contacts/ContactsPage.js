import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import s from "./ContactsPage.module.scss";

import AppRoutes from "../../helpers/AppRoutes";
import ContactsList from "../../components/ContactsList/ContactsList";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import InfoCard from "../../components/InfoCard/InfoCard";
import SortingWidget from "../../components/SortingWidget/SortingWidget";
import TabsWidget from "../../components/TabsWidget/TabsWidget";
import RoloSearch from "../../components/RoloSearch/RoloSearch";

export default function ContactsPage() {
	const [contacts, setContacts] = useState([]);
	const { contacts: allContacts } = useSelector((state) => state.contacts);

	useEffect(() => {
		setContacts(allContacts);
	}, [allContacts]);

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
				search={<RoloSearch data={allContacts} setData={setContacts} />}
			/>
		</div>
	);
}
