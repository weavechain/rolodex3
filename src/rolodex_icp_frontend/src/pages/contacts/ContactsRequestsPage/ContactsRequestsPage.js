import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { loadAskedFromMe, loadShare } from "../../../_redux/actions/contacts";

// Requests
export default function ContactsRequestsPage() {
	const history = useHistory();
	const dispatch = useDispatch();

	const reduxUser = useSelector(state => state.user);
	const reduxContacts = useSelector(state => state.contacts);

	const [requestingContacts, setRequestingContacts] = useState([]);

	useEffect(() => {
		dispatch(loadAskedFromMe(reduxUser.user.id))
	}, []);

	useEffect(() => {
		if (!reduxContacts.askedFromMe)
			return;

		const requestingUserIds = reduxContacts.askedFromMe
			.map(ask => ask.requestorId);
		const requestingContacts = reduxContacts.contacts.filter(c => requestingUserIds.includes(c.id));
		setRequestingContacts(requestingContacts);
	}, [reduxContacts]);

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

				<SortingWidget onUpdate={setRequestingContacts} members={requestingContacts} />
				<ContactsList
					contacts={requestingContacts}
					showNewEntries
					onContactSelected={respondToRequest}
				/>
			</div>

			<Footer
				page={AppRoutes.contacts}
				search={<RoloSearch data={requestingContacts} setData={setRequestingContacts} />}
			/>
		</div>
	);
}
