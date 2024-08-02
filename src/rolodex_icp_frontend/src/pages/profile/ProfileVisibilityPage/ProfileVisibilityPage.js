import React, { useEffect, useState } from "react";
import cx from "classnames";

import s from "./ProfileVisibilityPage.module.scss";

import Header from "../../../components/Header/Header";
import RoloButton from "../../../components/RoloButton/RoloButton";
import ProfileVisibilityWidget from "../../../components/ProfileVisibilityWidget/ProfileVisibilityWidget";

export default function ProfileVisibilityPage({
	coreProfile = {},
	directory,
	setParentDirectoryProfile = () => { },
	onSubmit = () => { },
	onBack = () => { },
}) {
	const [directoryProfile, setDirectoryProfile] = useState({});

	useEffect(() => {
		let dirProfileBuilder = {};
		for (const [key, value] of Object.entries(coreProfile)) {
			if (value)
				dirProfileBuilder[key] = { value: value, show: true };
		}
		if (!dirProfileBuilder.name) {
			dirProfileBuilder.name = { show: "nickname", value: dirProfileBuilder.nickname.value };
		}
		if (!dirProfileBuilder.address) {
			if (dirProfileBuilder.city?.value || dirProfileBuilder.state?.value || dirProfileBuilder.country?.value) {
				let fullAddress = [dirProfileBuilder.city?.value, dirProfileBuilder.state?.value, dirProfileBuilder.country?.value].join(", ");
				dirProfileBuilder.address = { show: "city, state, & country", value: fullAddress };
			}
		}
		setDirectoryProfile(dirProfileBuilder);
		setParentDirectoryProfile(dirProfileBuilder);
	}, [coreProfile]);

	const updateDirectoryProfile = (newDirectoryProfile) => {
		setDirectoryProfile(newDirectoryProfile);
		setParentDirectoryProfile(newDirectoryProfile);
	}

	return (
		<div className={s.root}>
			<Header title="Customize Visibility" goBack={onBack} />

			<div className={s.content}>
				<ProfileVisibilityWidget
					directory={directory}
					directoryProfile={directoryProfile}
					updateProfile={updateDirectoryProfile}
				/>

				<div className={cx(s.section, s.buttons)}>
					<RoloButton
						text="Preview Directory Profile"
						onClick={() => onSubmit(coreProfile, directoryProfile)}
					/>
				</div>
			</div>
		</div>
	);
}
