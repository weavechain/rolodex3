import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";

import s from "./ContactsRequestsPage.module.scss";

import AppRoutes from "../../../helpers/AppRoutes";
import ContactsList from "../../../components/ContactsList/ContactsList";
import Footer from "../../../components/Footer/Footer";
import Header from "../../../components/Header/Header";
import InfoCard from "../../../components/InfoCard/InfoCard";
import SortingWidget from "../../../components/SortingWidget/SortingWidget";
import TabsWidget from "../../../components/TabsWidget/TabsWidget";
import RoloSearch from "../../../components/RoloSearch/RoloSearch";

export default function ContactsRequestsPage() {
	const history = useHistory();
	const [contacts, setContacts] = useState([]);
	const { requests: allContacts } = useSelector((state) => state.contacts);

	useEffect(() => {
		setContacts(allContacts);
	}, [allContacts]);

	// ------------------------------------- METHODS -------------------------------------
	const respondToRequest = () => {
		history.push(AppRoutes.contactsRespond);
	};

	return (
		<div className={s.root}>
			<Header title="Contacts" />

			<TabsWidget
				tabs={[
					{ name: "Contacts", url: `${AppRoutes.contacts}` },
					{
						name: "Requests",
						isActive: true,
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
					title="Requests for Information"
					description="New requests for info from you."
				/>

				<SortingWidget onUpdate={setContacts} members={allContacts} />
				<ContactsList
					contacts={contacts}
					showNewEntries
					onContactSelected={respondToRequest}
				/>
			</div>

			<Footer
				page={AppRoutes.contacts}
				search={<RoloSearch data={allContacts} setData={setContacts} />}
			/>
		</div>
	);
}
