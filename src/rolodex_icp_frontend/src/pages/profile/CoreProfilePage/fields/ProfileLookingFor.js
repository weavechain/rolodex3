import React, { useState, useEffect } from "react";
import s from "./ProfileFields.module.scss";

import { getProfileInfo } from "../../../../helpers/Utils";
import LookingForSelector from "../../../../components/selectors/LookingForSelector/LookingForSelector";
import FieldDisplayText from "./common/FieldDisplayText";

export default function ProfileLookingFor({
	profile,
	showEdit,
	updateModel = () => {},
}) {
	const [isEditMode, setIsEditMode] = useState(false);

	const name = "lookingFor";
	const values = getProfileInfo(profile, name) || [];
	const valueText = values.join(", ");

	useEffect(() => {
		if (!showEdit) {
			setIsEditMode(showEdit);
		}
	}, [showEdit]);

	return (
		<div className={s.root}>
			<div className={s.section}>
				<div className={s.sectionHeader}>Looking For...</div>
				{isEditMode ? (
					<LookingForSelector
						value={values}
						noTitle
						onSelect={(value) => updateModel(name, value)}
					/>
				) : (
					<FieldDisplayText
						text={valueText}
						name={"lookingFor"}
						enterEditMode={() => setIsEditMode(true)}
					/>
				)}
			</div>
		</div>
	);
}
