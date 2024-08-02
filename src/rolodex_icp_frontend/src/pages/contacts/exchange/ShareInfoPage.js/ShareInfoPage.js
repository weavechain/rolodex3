import React, { useEffect, useState } from "react";
import cx from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";

import { getCommonDirectory, loadLatestShare, shareInfoVoluntarily } from "../../../../_redux/actions/contacts";

import s from "./ShareInfoPage.module.scss";

import AppRoutes from "../../../../helpers/AppRoutes";
import Header from "../../../../components/Header/Header";
import TabsWidget from "../../../../components/TabsWidget/TabsWidget";
import InfoCard from "../../../../components/InfoCard/InfoCard";
import RespondToRequestWidget from "../../RespondToRequest/RespondToRequestWidget/RespondToRequestWidget";
import RoloButton from "../../../../components/RoloButton/RoloButton";
import ShareInfoDialog from "../../../../components/ShareInfoDialog/ShareInfoDialog";
import { stripAndRemoveNestin } from "../../../../helpers/Utils";
import { getDirectoryProfile } from "../../../../_redux/actions/user";

export default function ShareInfo() {
	const history = useHistory();
	const dispatch = useDispatch();

	const { id } = useParams() || {};

	const currentUser = useSelector(state => state.user.coreProfile);
	const latestShare = useSelector(state => state.contacts.latestShare);
	const currentContact = useSelector(state => state.contacts.CURRENT_CONTACT);

	const [commonDirectoryProfile, setCommonDirectoryProfile] = useState(null);
	const [updatedProfile, setUpdatedProfile] = useState({});
	const [showDialog, setShowDialog] = useState(false);
	const [enrichedCurrentUser, setEnrichedCurrentUser] = useState(currentUser);

	const [doneEnrichingNesting, setDoneEnrichingNesting] = useState(false);

	// get latest share where: currentUser = giver, currentContat = asker
	useEffect(() => {
		dispatch(loadLatestShare(currentUser.userId, currentContact.userId));
	}, []);

	// get data shared in the common directory
	useEffect(() => {
		getCommonDirectory(currentUser.userId, currentContact.userId)
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

		if (!nestedEnrichedUser.name) {
			nestedEnrichedUser.name = { show: "nickname", value: nestedEnrichedUser.nickname.value };
		}

		setEnrichedCurrentUser(nestedEnrichedUser);
		setDoneEnrichingNesting(true);
	}, [latestShare, commonDirectoryProfile])

	if (!currentUser) {
		history.push(AppRoutes.contacts);
		return null;
	}

	const name = currentContact?.nickname
		? currentContact?.nickname
		: currentContact?.firstName
			? currentContact?.firstName
			: "user";

	// ------------------------------------- METHODS -------------------------------------
	const shareInfo = () => {
		setShowDialog(true);

		// Share info willingly
		let stripped = stripAndRemoveNestin(updatedProfile);
		if (updatedProfile.name?.show === "nickname") {
			stripped["nickname"] = updatedProfile.name.value;
			stripped["firstName"] = null;
			stripped["lastName"] = null;
		}
		dispatch(shareInfoVoluntarily(currentContact.userId, currentUser.userId, currentContact.wallet?.value, stripped));
	};

	return (
		<div className={s.root}>
			<Header title="Exchange Information" showBack />
			<TabsWidget
				tabs={[
					{
						name: "Request Info",
						url: `${AppRoutes.exchangeInfo}/${id}`,
					},
					{
						name: "Share Info",
						url: `${AppRoutes.exchangeInfo}/${id}/share`,
						isActive: true,
					},
				]}
			/>
			{showDialog ? (
				<ShareInfoDialog
					contactId={id}
					close={() => setShowDialog(false)}
				/>
			) : null}
			<div className={s.content}>
				<InfoCard title={`Connect with ${name}`}>
					<div className={s.cardText}>
						You can share information from your Core Profile with other members
						that aren't shared with the rest of the directory.
					</div>
				</InfoCard>

				<div className={s.fields}>
					{
						doneEnrichingNesting
							? <RespondToRequestWidget
								profile={enrichedCurrentUser}
								updateProfile={setUpdatedProfile}
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
