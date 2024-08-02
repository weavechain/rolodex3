import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import s from "./ContactsReceivedPage.module.scss";

import Header from "../../../components/Header/Header";
import AppRoutes from "../../../helpers/AppRoutes";
import Footer from "../../../components/Footer/Footer";
import TabsWidget from "../../../components/TabsWidget/TabsWidget";
import InfoCard from "../../../components/InfoCard/InfoCard";
import SortingWidget from "../../../components/SortingWidget/SortingWidget";
import RoloSearch from "../../../components/RoloSearch/RoloSearch";
import { getUnknownContacts, loadGivenToMe } from "../../../_redux/actions/contacts";
import GivingsToMeList from "../../../components/GivingsToMe/GivingsToMeList";

// Received
export default function ContactsReceivedPage() {
	const dispatch = useDispatch();

	const reduxContacts = useSelector(state => state.contacts);
	const coreProfile = useSelector(state => state.user.coreProfile);
	const [givingContacts, setGivingContacts] = useState([]);

	useEffect(() => {
		dispatch(loadGivenToMe(coreProfile.userId));
	}, []);

	useEffect(() => {
		if (!reduxContacts || !reduxContacts.givenToMe) // 0	1	0xf44ab...	216300737	0	{"id":1,"userId":0,"nickname":"Obi-Wan","first...	0	1721732465444
			return;

		let givingUserIds = reduxContacts.givenToMe.map(give => give.giverId);
		let givingKnownContacts = reduxContacts.contacts.filter(c => givingUserIds.includes(c.userId));

		const givingKnownContactsIds = givingKnownContacts.map(c => c.userId);
		const givingNonContactsIds = givingUserIds.filter(id => !givingKnownContactsIds.includes(id));
		getUnknownContacts(givingNonContactsIds, coreProfile.userId)
			.then(nonContacts => {
				givingKnownContacts.push(...nonContacts);
				return givingKnownContacts;
			})
			.then(allGivingContacts => {
				let listGivings = [];
				for (let i = 0; i < reduxContacts.givenToMe.length; i++) {
					let givingContact = allGivingContacts.filter(c => c.userId === reduxContacts.givenToMe[i].giverId)[0];
					let listGiving = { giving: reduxContacts.givenToMe[i], giver: givingContact };
					listGivings.push(listGiving);
				}
				setGivingContacts(listGivings);
			});
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

				<SortingWidget onUpdate={setGivingContacts} members={givingContacts} />
				<GivingsToMeList givings={givingContacts} showNewEntries />
			</div>

			<Footer
				page={AppRoutes.contacts}
				search={<RoloSearch data={givingContacts} setData={setGivingContacts} />}
			/>
		</div>
	);
}
