import React, { useEffect, useState } from "react";
import cx from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { getCommonDirectory, loadLatestShare, respondToRequest } from "../../../../_redux/actions/contacts";

import s from "./RespondToRequestInfo.module.scss";

import Header from "../../../../components/Header/Header";
import RoloButton from "../../../../components/RoloButton/RoloButton";
import InfoCard from "../../../../components/InfoCard/InfoCard";
import AppRoutes from "../../../../helpers/AppRoutes";
import ShareInfoDialog from "../../../../components/ShareInfoDialog/ShareInfoDialog";
import RespondToRequestWidget from "../RespondToRequestWidget/RespondToRequestWidget";
import TabsWidget from "../../../../components/TabsWidget/TabsWidget";
import { stripAndRemoveNestin } from "../../../../helpers/Utils";
import { getDirectoryProfile } from "../../../../_redux/actions/user";

export default function RespondToRequestInfo() {
	const history = useHistory();
	const dispatch = useDispatch();

	const currentUser = useSelector(state => state.user.coreProfile);
	const latestShare = useSelector(state => state.contacts.latestShare);
	const reduxContacts = useSelector(state => state.contacts);
	const currentAsking = reduxContacts.asking;

	const [enrichedCurrentUser, setEnrichedCurrentUser] = useState(currentUser);
	const [doneEnrichingNesting, setDoneEnrichingNesting] = useState(false);
	const [showDialog, setShowDialog] = useState(false);
	const [requestedFields, setRequestedFields] = useState([]);
	const [commonDirectoryProfile, setCommonDirectoryProfile] = useState(null);

	// TODO: just for debugging purposes
	const separateCurrentUserSetter = (newValue) => {
		setEnrichedCurrentUser(newValue);
	}

	// get latest share where: currentUser = giver, currentContat = asker
	useEffect(() => {
		dispatch(loadLatestShare(currentUser.userId, currentAsking.asker.userId));
	}, []);

	// get data shared in the common directory
	useEffect(() => {
		getCommonDirectory(currentUser.userId, currentAsking.asker.userId)
			.then(dirId => getDirectoryProfile(dirId, currentUser.userId))
			.then(dirProfile => setCommonDirectoryProfile(dirProfile));
	}, [])

	useEffect(() => {
		if (!currentUser)
			return;

		let nestedEnrichedUser = {};
		for (const kv of Object.entries(currentUser)) {
			nestedEnrichedUser[kv[0]] = { value: kv[1], show: false }
		}

		if (latestShare) {
			for (const kv of Object.entries(latestShare)) {
				nestedEnrichedUser[kv[0]] = { value: kv[1], show: true }
			}
		}
		if (commonDirectoryProfile) {
			for (const kv of Object.entries(commonDirectoryProfile)) {
				nestedEnrichedUser[kv[0]] = { value: kv[1], show: true }
			}
		}

		setEnrichedCurrentUser(nestedEnrichedUser);
		setDoneEnrichingNesting(true);
	}, [latestShare, commonDirectoryProfile])


	useEffect(() => {
		if (!currentAsking?.asking?.asked)
			return;

		setRequestedFields(JSON.parse(currentAsking.asking.asked));
	}, [reduxContacts]);


	useEffect(() => {
		setEnrichedCurrentUser(currentUser);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (!reduxContacts) {
		history.push(AppRoutes.contacts);
		return null;
	}

	const name = currentAsking?.asker?.nickname;

	// ------------------------------------- METHODS -------------------------------------
	const shareInfo = () => {
		setShowDialog(true);

		let stripped = stripAndRemoveNestin(enrichedCurrentUser);
		dispatch(respondToRequest(currentAsking.asker.wallet, currentAsking.asker.userId, currentUser.userId, requestedFields, stripped));
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
					contactId={currentAsking.asker.userId}
					close={() => setShowDialog(false)}
				/>
			) : null}

			<div className={s.content}>
				<InfoCard
					title={`Connect with ${name}`}
					description={`${name} requested the info in green below. If you haven't added all of the info from their request to your core profile yet, input it here and we’ll add it to your core profile. Remember, your core profile info will not be shared with any directories or other contacts unless you explicitly share it later.`}
				/>

				<div className={s.fields}>
					{
						doneEnrichingNesting
							? <RespondToRequestWidget
								profile={enrichedCurrentUser}
								requestedFields={requestedFields}
								updateProfile={separateCurrentUserSetter}
							/>
							: null
					}

					<div className={cx(s.section, s.buttons)}>
						<RoloButton text="Share Information" onClick={shareInfo} />
					</div>
				</div>
			</div>
		</div>
	);
}
