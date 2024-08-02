import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";

import s from "./ContactsRequestsPage.module.scss";

import AppRoutes from "../../../helpers/AppRoutes";
import Footer from "../../../components/Footer/Footer";
import Header from "../../../components/Header/Header";
import InfoCard from "../../../components/InfoCard/InfoCard";
import SortingWidget from "../../../components/SortingWidget/SortingWidget";
import TabsWidget from "../../../components/TabsWidget/TabsWidget";
import RoloSearch from "../../../components/RoloSearch/RoloSearch";
import { getUnknownContacts, loadAskedFromMe } from "../../../_redux/actions/contacts";
import AskingsFromMeList from "../../../components/AskingsFromMeList/AskingsFromMeList";

// Requests
export default function ContactsRequestsPage() {
	const history = useHistory();
	const dispatch = useDispatch();

	const coreProfile = useSelector(state => state.user.coreProfile);
	const reduxContacts = useSelector(state => state.contacts);

	const [requestingContacts, setRequestingContacts] = useState([]);

	useEffect(() => {
		dispatch(loadAskedFromMe(coreProfile.userId))
	}, []);

	useEffect(() => {
		if (!reduxContacts.askedFromMe) // <1	216300737	0	["lastName"]	0	1721730213932>
			return;

		let requestingUserIds = reduxContacts.askedFromMe.map(ask => ask.askerId);
		let requestingKnownContacts = reduxContacts.contacts.filter(c => requestingUserIds.includes(c.userId));

		const requestingKnownContactsIds = requestingKnownContacts.map(c => c.userId);
		const requestingNonContactIds = requestingUserIds.filter(id => !requestingKnownContactsIds.includes(id));
		getUnknownContacts(requestingNonContactIds, coreProfile.userId)
			.then(nonContacts => {
				requestingKnownContacts.push(...nonContacts);
				return requestingKnownContacts;
			})
			.then(allRequestingContats => {
				let listAskings = [];
				for (let i = 0; i < reduxContacts.askedFromMe.length; i++) {
					let requestingContact = allRequestingContats.filter(c => c.userId === reduxContacts.askedFromMe[i].askerId)[0];
					let listAsking = { asking: reduxContacts.askedFromMe[i], asker: requestingContact };
					listAskings.push(listAsking);
				}
				setRequestingContacts(listAskings);
			});
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
				<AskingsFromMeList
					askings={requestingContacts}
					showNewEntries
					onAskingSelected={respondToRequest}
				/>
			</div>

			<Footer
				page={AppRoutes.contacts}
				search={<RoloSearch data={requestingContacts} setData={setRequestingContacts} />}
			/>
		</div>
	);
}
