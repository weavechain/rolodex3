import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import s from "./ContactsReceivedPage.module.scss";

import Header from "../../../components/Header/Header";
import AppRoutes from "../../../helpers/AppRoutes";
import Footer from "../../../components/Footer/Footer";
import TabsWidget from "../../../components/TabsWidget/TabsWidget";
import InfoCard from "../../../components/InfoCard/InfoCard";
import SortingWidget from "../../../components/SortingWidget/SortingWidget";
import ContactsList from "../../../components/ContactsList/ContactsList";
import RoloSearch from "../../../components/RoloSearch/RoloSearch";

export default function ContactsReceivedPage() {
	const [contacts, setContacts] = useState([]);
	const { received: allContacts } = useSelector((state) => state.contacts);

	useEffect(() => {
		setContacts(allContacts);
	}, [allContacts]);

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

				<SortingWidget onUpdate={setContacts} members={allContacts} />
				<ContactsList contacts={contacts} showNewEntries />
			</div>

			<Footer
				page={AppRoutes.contacts}
				search={<RoloSearch data={allContacts} setData={setContacts} />}
			/>
		</div>
	);
}
