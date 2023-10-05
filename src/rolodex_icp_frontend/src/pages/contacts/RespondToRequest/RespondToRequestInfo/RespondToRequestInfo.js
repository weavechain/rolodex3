import React, { useEffect, useState } from "react";
import cx from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { respondToRequest } from "../../../../_redux/actions/contacts";

import s from "./RespondToRequestInfo.module.scss";

import Header from "../../../../components/Header/Header";
import RoloButton from "../../../../components/RoloButton/RoloButton";
import InfoCard from "../../../../components/InfoCard/InfoCard";
import AppRoutes from "../../../../helpers/AppRoutes";
import ShareInfoDialog from "../../../../components/ShareInfoDialog/ShareInfoDialog";
import RespondToRequestWidget from "../RespondToRequestWidget/RespondToRequestWidget";
import TabsWidget from "../../../../components/TabsWidget/TabsWidget";

export default function RespondToRequestInfo() {
	const history = useHistory();
	const dispatch = useDispatch();

	const [updatedProfile, setUpdatedProfile] = useState({});
	const [showDialog, setShowDialog] = useState(false);

	const { CURRENT_DIRECTORY } = useSelector((state) => state.directories);
	const { CURRENT_CONTACT } = useSelector((state) => state.contacts);

	useEffect(() => {
		setUpdatedProfile(CURRENT_CONTACT);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (!CURRENT_CONTACT) {
		history.push(AppRoutes.contacts);
		return null;
	}

	const requestedFields = CURRENT_CONTACT.fields;
	const requestor = CURRENT_CONTACT.requestor;
	const name = requestor?.name?.value;

	// ------------------------------------- METHODS -------------------------------------
	const shareInfo = () => {
		setShowDialog(true);

		// Share info
		dispatch(respondToRequest({ ...updatedProfile, was_seen: false }));
	};

	return (
		<div className={s.root}>
			<Header title="Answer Info Request" showBack />

			<TabsWidget
				tabs={[
					{
						name: "Share Information",
						url: `${AppRoutes.contactsRespond}`,
						isActive: true,
					},
					{
						name: "View Requestor Profile",
						url: `${AppRoutes.contactsRespond}/profile`,
					},
				]}
			/>

			{showDialog ? (
				<ShareInfoDialog
					contactId={CURRENT_CONTACT.id}
					directory={CURRENT_DIRECTORY}
					close={() => setShowDialog(false)}
				/>
			) : null}

			<div className={s.content}>
				<InfoCard
					title={`Connect with ${name}`}
					description={`${name} requested the info in green below. If you haven't added all of the info from their request to your core profile yet, input it here and we’ll add it to your core profile. Remember, your core profile info will not be shared with any directories or other contacts unless you explicitly share it later.`}
				/>

				<div className={s.fields}>
					<RespondToRequestWidget
						profile={updatedProfile}
						requestedFields={requestedFields}
						updateProfile={setUpdatedProfile}
					/>

					<div className={cx(s.section, s.buttons)}>
						<RoloButton text="Share Information" onClick={shareInfo} />
					</div>
				</div>
			</div>
		</div>
	);
}
