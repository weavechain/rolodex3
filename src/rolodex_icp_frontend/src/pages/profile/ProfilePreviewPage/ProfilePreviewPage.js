import React from "react";
import cx from "classnames";
import { useSelector } from "react-redux";

import s from "./ProfilePreviewPage.module.scss";

import Header from "../../../components/Header/Header";
import RoloButton from "../../../components/RoloButton/RoloButton";
import ProfileViewWidget from "../../../components/ProfileViewWidget/ProfileViewWidget";

export default function ProfilePreviewPage({
	profile,
	onSubmit = () => {},
	onBack = () => {},
}) {
	const { CURRENT_DIRECTORY = {} } = useSelector((state) => state.directories);

	return (
		<div className={s.root}>
			<Header title="Join Directory" goBack={onBack} />

			<div className={s.content}>
				<ProfileViewWidget profile={profile} directory={CURRENT_DIRECTORY} isNested={true} />

				<div className={cx(s.section, s.buttons)}>
					<RoloButton text="Join Directory" onClick={onSubmit} />
				</div>
			</div>
		</div>
	);
}
