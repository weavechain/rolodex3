import React from "react";
import { useSelector } from "react-redux";

import s from "./RespondViewProfile.module.scss";

import Header from "../../../../components/Header/Header";
import ProfileViewWidget from "../../../../components/ProfileViewWidget/ProfileViewWidget";
import TabsWidget from "../../../../components/TabsWidget/TabsWidget";
import AppRoutes from "../../../../helpers/AppRoutes";

export default function RespondViewProfile() {
	const { CURRENT_CONTACT = {} } = useSelector((state) => state.contacts);

	return (
		<div className={s.root}>
			<Header title="Answer Info Request" showBack />

			<TabsWidget
				tabs={[
					{
						name: "Share Information",
						url: `${AppRoutes.contactsRespond}`,
					},
					{
						name: "View Requestor Profile",
						url: `${AppRoutes.contactsRespond}/profile`,
						isActive: true,
					},
				]}
			/>

			<div className={s.content}>
				<ProfileViewWidget profile={CURRENT_CONTACT.requestor} />
			</div>
		</div>
	);
}
