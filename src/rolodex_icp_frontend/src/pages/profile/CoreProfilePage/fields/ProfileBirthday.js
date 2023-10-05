import React, { useState, useEffect } from "react";
import moment from "moment";
import s from "./ProfileFields.module.scss";

import { getProfileInfo } from "../../../../helpers/Utils";
import DateTimePicker from "../../../../components/DateTimePicker/DateTimePicker";
import FieldDisplayText from "./common/FieldDisplayText";

export default function ProfileBirthday({
	profile,
	showEdit,
	updateModel = () => {},
}) {
	const [isEditMode, setIsEditMode] = useState(false);

	const field = "birthday";
	const value = getProfileInfo(profile, field) || "";
	const displayValue = value ? moment(value).format("MMM DD, YYYY") : "";

	useEffect(() => {
		if (!showEdit) {
			setIsEditMode(showEdit);
		}
	}, [showEdit]);

	return (
		<div className={s.root}>
			<div className={s.section}>
				<div className={s.sectionHeader}>Birthday</div>
				{isEditMode ? (
					<DateTimePicker
						selecteDate={value}
						onChange={(value) => updateModel(field, value)}
					/>
				) : (
					<FieldDisplayText
						name={field}
						text={displayValue}
						enterEditMode={() => setIsEditMode(true)}
					/>
				)}
			</div>
		</div>
	);
}
