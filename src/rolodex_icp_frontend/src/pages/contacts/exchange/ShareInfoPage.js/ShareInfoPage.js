import React, { useEffect, useState } from "react";
import cx from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";

import { shareInfoVoluntarily } from "../../../../_redux/actions/contacts";

import s from "./ShareInfoPage.module.scss";

import AppRoutes from "../../../../helpers/AppRoutes";
import Header from "../../../../components/Header/Header";
import TabsWidget from "../../../../components/TabsWidget/TabsWidget";
import InfoCard from "../../../../components/InfoCard/InfoCard";
import RespondToRequestWidget from "../../RespondToRequest/RespondToRequestWidget/RespondToRequestWidget";
import RoloButton from "../../../../components/RoloButton/RoloButton";
import ShareInfoDialog from "../../../../components/ShareInfoDialog/ShareInfoDialog";

export default function ShareInfo() {
	const history = useHistory();
	const dispatch = useDispatch();

	const [updatedProfile, setUpdatedProfile] = useState({});
	const [showDialog, setShowDialog] = useState(false);
	const { id } = useParams() || {};

	const { CURRENT_DIRECTORY } = useSelector((state) => state.directories);
	const { CURRENT_CONTACT } = useSelector((state) => state.contacts);
	const user = useSelector(state => state.user.user);

	useEffect(() => {
		setUpdatedProfile(user);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (!user) {
		history.push(AppRoutes.contacts);
		return null;
	}

	const name = CURRENT_CONTACT?.nickname?.value;

	// ------------------------------------- METHODS -------------------------------------
	const shareInfo = () => {
		setShowDialog(true);

		// Share info willingly
		dispatch(shareInfoVoluntarily(CURRENT_CONTACT.id, user.id, CURRENT_CONTACT.wallet.value, updatedProfile));
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
					directory={CURRENT_DIRECTORY}
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
					<RespondToRequestWidget
						profile={updatedProfile}
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
