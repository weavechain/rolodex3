import React from "react";
import { useSelector } from "react-redux";

import s from "./ContactProfilePage.module.scss";

import Header from "../../../components/Header/Header";
import ProfileViewWidget from "../../../components/ProfileViewWidget/ProfileViewWidget";
import AppRoutes from "../../../helpers/AppRoutes";
import ExchangeIcon from "../../../components/icons/ExchangeIcon";

export default function ContactProfilePage() {
	const { CURRENT_CONTACT = {} } = useSelector((state) => state.contacts);

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
				<ProfileViewWidget profile={CURRENT_CONTACT} />
			</div>
		</div>
	);
}
