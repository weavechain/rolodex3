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
	const coreProfile = useSelector(state => state.user.coreProfile);
	let latestShare = useSelector(state => state.contacts.latestShare);

	let [enrichedContact, setEnrichedContact] = useState(CURRENT_CONTACT);

	useEffect(() => {
		dispatch(loadLatestShare(CURRENT_CONTACT.userId, coreProfile.userId));
	}, []);

	useEffect(() => {
		if (!latestShare) {
			setEnrichedContact(CURRENT_CONTACT);
			return;
		}

		for (var propertyName in CURRENT_CONTACT) {
			if (CURRENT_CONTACT[propertyName]) {
				latestShare[propertyName] = CURRENT_CONTACT[propertyName];
			}
		}
		setEnrichedContact(latestShare);
	}, [latestShare])

	return (
		<div className={s.root}>
			<Header title="Contact Profile" showBack>
				<div className={s.headerIcon}>
					<a href={`#${AppRoutes.exchangeInfo}/${CURRENT_CONTACT.userId}`}>
						<ExchangeIcon />
					</a>
				</div>
			</Header>
			<div className={s.content}>
				<ProfileViewWidget profile={enrichedContact} isNested={false} />
			</div>
		</div>
	);
}
