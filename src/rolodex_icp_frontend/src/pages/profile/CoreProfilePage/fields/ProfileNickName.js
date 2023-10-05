import React, { useState, useEffect } from "react";

import s from "./ProfileFields.module.scss";

import { getProfileInfo } from "../../../../helpers/Utils";
import InputWidget from "../../../../components/InputWidget/InputWidget";
import FieldDisplayText from "./common/FieldDisplayText";

export default function ProfileNickName({
	profile,
	metamaskAccount,
	showEdit,
	updateModel = () => {},
}) {
	const [isEditMode, setIsEditMode] = useState(false);
	const nickname = getProfileInfo(profile, "nickname") || "";

	useEffect(() => {
		if (!showEdit) {
			setIsEditMode(showEdit);
		}
	}, [showEdit]);

	return (
		<div className={s.root}>
			<div className={s.section}>
				<div className={s.sectionHeader}>
					Nickname
					{!metamaskAccount ? <span className="mandatory">*</span> : null}
				</div>
				{isEditMode ? (
					<InputWidget
						isMandatory
						value={nickname}
						placeholder="ex. jim"
						onChange={(value) => updateModel("nickname", value)}
						titleClass={s.sectionTitle}
					/>
				) : (
					<FieldDisplayText
						text={nickname}
						name={"nickname"}
						enterEditMode={() => setIsEditMode(true)}
					/>
				)}
			</div>
		</div>
	);
}
