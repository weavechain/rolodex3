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
	updateModel = () => { },
}) {
	const [isEditMode, setIsEditMode] = useState(false);

	const email = getProfileInfo(profile, "email");

	useEffect(() => {
		if (!showEdit) {
			setIsEditMode(showEdit);
		}
	}, [showEdit]);

	return (
		<div className={s.root}>
			<div className={s.section}>
				<div className={s.sectionHeader}>
					Email
					{!metamaskAccount ? <span className="mandatory">*</span> : null}
				</div>

				{isEditMode ? (
					<InputWidget
						isMandatory
						value={email}
						placeholder="sean@futureofdev.com"
						onChange={(value) => updateModel("email", value)}
						titleClass={s.sectionTitle}
					/>
				) : (
					<FieldDisplayText
						text={email}
						name={"email"}
						enterEditMode={() => setIsEditMode(true)}
					/>
				)}
			</div>
		</div>
	);
}
