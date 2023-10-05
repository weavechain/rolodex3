import React, { useEffect, useState } from "react";
import cx from "classnames";

import s from "./ProfileVisibilityPage.module.scss";

import Header from "../../../components/Header/Header";
import RoloButton from "../../../components/RoloButton/RoloButton";
import ProfileVisibilityWidget from "../../../components/ProfileVisibilityWidget/ProfileVisibilityWidget";

export default function ProfileVisibilityPage({
	profile = {},
	directory,
	onSubmit = () => {},
	onBack = () => {},
}) {
	const [visibleProfile, setVisibleProfile] = useState({});

	useEffect(() => {
		setVisibleProfile(profile);
	}, [profile]);

	return (
		<div className={s.root}>
			<Header title="Customize Visibility" goBack={onBack} />

			<div className={s.content}>
				<ProfileVisibilityWidget
					directory={directory}
					profile={visibleProfile}
					updateProfile={setVisibleProfile}
				/>

				<div className={cx(s.section, s.buttons)}>
					<RoloButton
						text="Preview Directory Profile"
						onClick={() => onSubmit(visibleProfile)}
					/>
				</div>
			</div>
		</div>
	);
}
