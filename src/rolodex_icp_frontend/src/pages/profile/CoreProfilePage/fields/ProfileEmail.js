import React, { useState, useEffect } from "react";
import s from "./ProfileFields.module.scss";

import { getProfileInfo, hasItems } from "../../../../helpers/Utils";

import InputWidget from "../../../../components/InputWidget/InputWidget";
import FieldDisplayText from "./common/FieldDisplayText";
import PlusIcon from "../../../../components/icons/PlusIcon";

export default function ProfileEmail({
	profile,
	showEdit,
	metamaskAccount,
	updateModel = () => {},
}) {
	const [isEditMode, setIsEditMode] = useState(false);
	const email = getProfileInfo(profile, "email");
	const [otherEmails, setOtherEmails] = useState([""]);

	useEffect(() => {
		const additionalEmail = profile.otherEmails?.value;
		if (additionalEmail) {
			setOtherEmails(additionalEmail);
		}
	}, [profile]);

	useEffect(() => {
		if (!showEdit) {
			setIsEditMode(showEdit);
		}
	}, [showEdit]);

	// ------------------------------------- METHODS -------------------------------------
	const addNewEmail = () => {
		setOtherEmails((prev) => [...prev, ""]);
	};

	const updateEmail = (emailText, index) => {
		if (hasItems(otherEmails) && otherEmails[index] !== undefined) {
			otherEmails[index] = emailText;
			setOtherEmails([...otherEmails]);
			updateModel("otherEmails", otherEmails);
		}
	};

	return (
		<div className={s.root}>
			<div className={s.section}>
				<div className={s.sectionHeader}>
					Email
					{!metamaskAccount ? <span className="mandatory">*</span> : null}
				</div>
				{isEditMode ? (
					<div className={s.emailsContainer}>
						<div className={s.primary}>
							<span className={s.email}>{email}</span>
							<span className={s.note}>Primary</span>
						</div>

						<div className={s.otherEmails}>
							<div className={s.otherHeader}>Additional Email</div>
							{otherEmails.map((em, index) => (
								<div className={s.otherEmail} key={index}>
									<InputWidget
										value={em || ""}
										placeholder="ex. sean@futureofdev.com"
										onChange={(value) => updateEmail(value, index)}
										titleClass={s.sectionTitle}
										validationRegex="^[^\s@]+@[^\s@]+\.[^\s@]{2,}$"
									/>
								</div>
							))}
						</div>

						<div className={s.additionalButton} onClick={addNewEmail}>
							<PlusIcon />
							<span className={s.addText}>Add Additional Email</span>
						</div>
					</div>
				) : (
					<FieldDisplayText
						text={email}
						name="email"
						enterEditMode={() => setIsEditMode(true)}
					/>
				)}
			</div>
		</div>
	);
}
