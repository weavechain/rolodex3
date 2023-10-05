import React, { useState, useEffect } from "react";
import s from "./ProfileFields.module.scss";

import { getProfileInfo } from "../../../../helpers/Utils";
import InputWidget from "../../../../components/InputWidget/InputWidget";
import FieldDisplayText from "./common/FieldDisplayText";

export default function ProfileGenericField({
	profile,
	name,
	showEdit,
	title,
	placeholder = "ex. jim",
	updateModel = () => {},
}) {
	const [isEditMode, setIsEditMode] = useState(false);

	const value = getProfileInfo(profile, name) || "";

	useEffect(() => {
		if (!showEdit) {
			setIsEditMode(showEdit);
		}
	}, [showEdit]);

	return (
		<div className={s.root}>
			<div className={s.section}>
				<div className={s.sectionHeader}>{title || name}</div>
				{isEditMode ? (
					<InputWidget
						isMandatory
						value={value}
						placeholder={placeholder}
						onChange={(newVal) => updateModel(name, newVal)}
						titleClass={s.sectionTitle}
					/>
				) : (
					<FieldDisplayText
						text={value}
						name={name}
						enterEditMode={() => setIsEditMode(true)}
					/>
				)}
			</div>
		</div>
	);
}
