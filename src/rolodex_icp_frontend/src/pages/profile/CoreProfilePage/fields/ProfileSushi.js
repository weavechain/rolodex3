import React, { useState, useEffect } from "react";
import s from "./ProfileFields.module.scss";

import { getProfileInfo } from "../../../../helpers/Utils";
import SushiSelector from "../../../../components/selectors/SushiSelector/SushiSelector";
import FieldDisplayText from "./common/FieldDisplayText";

export default function ProfileSushi({
	profile,
	showEdit,
	updateModel = () => {},
}) {
	const [isEditMode, setIsEditMode] = useState(false);

	const name = "favorite_sushi";
	const value = getProfileInfo(profile, name) || [];

	useEffect(() => {
		if (!showEdit) {
			setIsEditMode(showEdit);
		}
	}, [showEdit]);

	return (
		<div className={s.root}>
			<div className={s.section}>
				<div className={s.sectionHeader}>Favorite Sushi</div>
				{isEditMode ? (
					<SushiSelector
						value={value}
						noTitle
						onSelect={(value) => updateModel(name, value)}
					/>
				) : (
					<FieldDisplayText
						text={value}
						name={"sushi"}
						enterEditMode={() => setIsEditMode(true)}
					/>
				)}
			</div>
		</div>
	);
}
