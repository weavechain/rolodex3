import React, { useState, useEffect } from "react";

import s from "./ProfileFields.module.scss";

import { getProfileInfo } from "../../../../helpers/Utils";
import InputWidget from "../../../../components/InputWidget/InputWidget";
import FieldDisplayText from "./common/FieldDisplayText";

export default function ProfileName({
	profile,
	updateModel = () => {},
	showEdit = false,
}) {
	const [isEditMode, setIsEditMode] = useState(false);
	const firstName = getProfileInfo(profile, "firstName") || "";
	const lastName = getProfileInfo(profile, "lastName") || "";

	useEffect(() => {
		if (!showEdit) {
			setIsEditMode(showEdit);
		}
	}, [showEdit]);

	return (
		<div className={s.root}>
			<div className={s.sectionHeader}>Name</div>

			{isEditMode ? (
				<div className={s.grid}>
					<div className={s.section}>
						<InputWidget
							value={firstName}
							placeholder="ex. Jim"
							onChange={(value) => updateModel("firstName", value)}
							titleClass={s.sectionTitle}
						/>
						<div className={s.sectionLabel}>First</div>
					</div>

					<div className={s.section}>
						<InputWidget
							value={lastName}
							placeholder="ex. Smith"
							onChange={(value) => updateModel("lastName", value)}
							titleClass={s.sectionTitle}
						/>
						<div className={s.sectionLabel}>Last</div>
					</div>
				</div>
			) : (
				<div className={s.section}>
					<FieldDisplayText
						text={`${firstName} ${lastName}`}
						name={"name"}
						enterEditMode={() => setIsEditMode(true)}
					/>
				</div>
			)}
		</div>
	);
}
