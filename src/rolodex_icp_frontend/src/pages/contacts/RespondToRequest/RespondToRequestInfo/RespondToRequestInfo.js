import React, { useEffect, useState } from "react";
import cx from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { loadLatestShare, respondToRequest } from "../../../../_redux/actions/contacts";

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

	const [showDialog, setShowDialog] = useState(false);
	const [requestedFields, setRequestedFields] = useState([]);

	const reduxContacts = useSelector(state => state.contacts);
	const currentRequestor = reduxContacts.CURRENT_CONTACT;
	let currentUser = useSelector(state => state.user.user);

	let [enrichedCurrentUser, setEnrichedCurrentUser] = useState(currentUser);
	let latestShare = useSelector(state => state.contacts.latestShare);

	const separateCurrentUserSetter = (newValue) => {
		setEnrichedCurrentUser(newValue);
	}

	useEffect(() => {
		dispatch(loadLatestShare(currentUser.id, currentRequestor.id));
	}, []);

	useEffect(() => {
		if (!latestShare)
			return;

		for (var propertyName in latestShare) {
			if (latestShare[propertyName]?.show === true || latestShare[propertyName]?.show === 'true') {
				currentUser[propertyName] = latestShare[propertyName];
			}
		}
		setEnrichedCurrentUser(currentUser);
	}, [latestShare])


	useEffect(() => {
		if (!reduxContacts?.askedFromMe)
			return;

		setRequestedFields(reduxContacts.askedFromMe
			.filter(r => r.requestorId === currentRequestor.id)
			.flatMap(r => JSON.parse(r.requested_data)));
	}, [reduxContacts]);


	useEffect(() => {
		setEnrichedCurrentUser(currentUser);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (!reduxContacts) {
		history.push(AppRoutes.contacts);
		return null;
	}

	const name = currentRequestor?.name?.value;

	// ------------------------------------- METHODS -------------------------------------
	const shareInfo = () => {
		setShowDialog(true);

		// Share info
		dispatch(respondToRequest(currentRequestor.wallet, currentRequestor.id, currentUser.id, requestedFields, { ...enrichedCurrentUser, was_seen: false }));
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
					contactId={currentRequestor.id}
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
						profile={enrichedCurrentUser}
						requestedFields={requestedFields}
						updateProfile={separateCurrentUserSetter}
					/>

					<div className={cx(s.section, s.buttons)}>
						<RoloButton text="Share Information" onClick={shareInfo} />
					</div>
				</div>
			</div>
		</div>
	);
}
