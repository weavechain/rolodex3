import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import s from "./ContactProfilePage.module.scss";

import Header from "../../../components/Header/Header";
import ProfileViewWidget from "../../../components/ProfileViewWidget/ProfileViewWidget";
import AppRoutes from "../../../helpers/AppRoutes";
import ExchangeIcon from "../../../components/icons/ExchangeIcon";
import { loadLatestShare } from "../../../_redux/actions/contacts";

export default function ContactProfilePage(id) {
	const dispatch = useDispatch();

	const { CURRENT_CONTACT = {} } = useSelector(state => state.contacts);
	const user = useSelector(state => state.user.user);
	let latestShare = useSelector(state => state.contacts.latestShare);

	let [enrichedContact, setEnrichedContact] = useState(CURRENT_CONTACT);

	useEffect(() => {
		dispatch(loadLatestShare(CURRENT_CONTACT.id, user.id));
	}, []);

	useEffect(() => {
		if (!latestShare)
			return;

		for (var propertyName in CURRENT_CONTACT) {
			if (CURRENT_CONTACT[propertyName]?.show === true || CURRENT_CONTACT[propertyName]?.show === 'true') {
				latestShare[propertyName] = CURRENT_CONTACT[propertyName];
			}
		}
		setEnrichedContact(latestShare);
	}, [latestShare])

	return (
		<div className={s.root}>
			<Header title="Contact Profile" showBack>
				<div className={s.headerIcon}>
					<a href={`#${AppRoutes.exchangeInfo}/${CURRENT_CONTACT.id}`}>
						<ExchangeIcon />
					</a>
				</div>
			</Header>
			<div className={s.content}>
				<ProfileViewWidget profile={enrichedContact} />
			</div>
		</div>
	);
}
