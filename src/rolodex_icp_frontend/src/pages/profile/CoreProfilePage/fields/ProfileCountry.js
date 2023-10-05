import React, { useState, useEffect } from "react";
import s from "./ProfileFields.module.scss";

import { getProfileInfo } from "../../../../helpers/Utils";
import CountrySelector from "../../../../components/selectors/CountrySelector/CountrySelector";
import FieldDisplayText from "./common/FieldDisplayText";

export default function ProfileCountry({
	profile,
	showEdit,
	updateModel = () => {},
}) {
	const [isEditMode, setIsEditMode] = useState(false);

	const name = "country";
	const value = getProfileInfo(profile, name) || "";

	useEffect(() => {
		if (!showEdit) {
			setIsEditMode(showEdit);
		}
	}, [showEdit]);

	return (
		<div className={s.root}>
			<div className={s.section}>
				<div className={s.sectionHeader}>Country</div>
				{isEditMode ? (
					<CountrySelector
						value={value}
						noTitle
						onSelect={(value) => updateModel(name, value)}
					/>
				) : (
					<FieldDisplayText
						text={value}
						name={"country"}
						enterEditMode={() => setIsEditMode(true)}
					/>
				)}
			</div>
		</div>
	);
}
