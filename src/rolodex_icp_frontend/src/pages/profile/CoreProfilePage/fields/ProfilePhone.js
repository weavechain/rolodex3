import React, { useState, useEffect } from "react";
import s from "./ProfileFields.module.scss";

import { getProfileInfo, hasItems } from "../../../../helpers/Utils";
import InputWidget from "../../../../components/InputWidget/InputWidget";
import FieldDisplayText from "./common/FieldDisplayText";
import PlusIcon from "../../../../components/icons/PlusIcon";

export default function ProfilePhone({
	profile,
	showEdit,
	updateModel = () => {},
}) {
	const [isEditMode, setIsEditMode] = useState(false);
	const [phones, setPhones] = useState([]);

	const name = "phone";
	const value = getProfileInfo(profile, name) || "";
	console.debug(profile.phone);

	useEffect(() => {
		const phone = profile.phone?.value;
		const phoneNumbers = Array.isArray(phone) ? phone : [phone];
		if (hasItems(phoneNumbers)) {
			setPhones(phoneNumbers);
		}
	}, [profile]);

	useEffect(() => {
		setIsEditMode(true);
		if (!showEdit) {
			//setIsEditMode(showEdit);
		}
	}, [showEdit]);

	// ------------------------------------- METHODS -------------------------------------
	const addNewNumber = () => {
		setPhones((prev) => [...prev, ""]);
	};

	const updatePhoneNumber = (emailText, index) => {
		if (hasItems(phones) && phones[index] !== undefined) {
			phones[index] = emailText;
			setPhones([...phones]);
			updateModel("phone", phones);
		}
	};

	return (
		<div className={s.root}>
			<div className={s.section}>
				<div className={s.sectionHeader}>Phone</div>
				{isEditMode ? (
					<div className={s.phoneNumbers}>
						{phones.map((p, index) => (
							<div className={s.phoneNumber} key={index}>
								<InputWidget
									isMandatory
									value={p}
									placeholder={"ex. +1 (555) 555-5555"}
									onChange={(value) => updatePhoneNumber(value, index)}
									titleClass={s.sectionTitle}
								/>
							</div>
						))}

						<div className={s.additionalButton} onClick={addNewNumber}>
							<PlusIcon />
							<span className={s.addText}>Add Phone</span>
						</div>
					</div>
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
