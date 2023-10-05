import React from "react";
import cx from "classnames";

import s from "./ProfilePage.module.scss";

import InputWidget from "../../../components/InputWidget/InputWidget";
import JobTitleSelector from "../../../components/selectors/JobTitleSelector/JobTitleSelector";
import RoloButton from "../../../components/RoloButton/RoloButton";
import ArrowRightEmptyIcon from "../../../components/icons/ArrowRightEmptyIcon";
import { getProfileInfo } from "../../../helpers/Utils";

export default function ProfileOptionalFields({
	userModel,
	updateModel = () => {},
	onSubmit = () => {},
}) {
	// ------------------------------------- METHODS -------------------------------------
	return (
		<div className={s.content}>
			<div onClick={onSubmit} className={s.skipText}>
				Skip for Now
				<ArrowRightEmptyIcon />
			</div>

			{/* CITY */}
			<div className={s.section}>
				<InputWidget
					title="City"
					value={getProfileInfo(userModel, "city")}
					placeholder="ex. nyc"
					onChange={(value) => updateModel("city", value)}
					titleClass={s.sectionTitle}
				/>
			</div>

			{/* STATE / PROVINCE */}
			<div className={s.section}>
				<InputWidget
					title="State / Province"
					value={getProfileInfo(userModel, "state")}
					placeholder="ex. California"
					onChange={(value) => updateModel("state", value)}
					titleClass={s.sectionTitle}
				/>
			</div>

			{/* JOB TITLE */}
			<div className={s.section}>
				<JobTitleSelector
					value={getProfileInfo(userModel, "jobTitle")}
					onSelect={(value) => updateModel("jobTitle", value)}
				/>
			</div>

			{/* COMPANY */}
			<div className={s.section}>
				<InputWidget
					title="Company"
					value={getProfileInfo(userModel, "company")}
					placeholder="ex. Dunder Mifflin"
					onChange={(value) => updateModel("company", value)}
					titleClass={s.sectionTitle}
				/>
			</div>

			{/* PHONE */}
			<div className={s.section}>
				<InputWidget
					title="Phone"
					value={getProfileInfo(userModel, "phone")}
					placeholder="ex. 212-000-3123"
					onChange={(value) => updateModel("phone", value)}
					titleClass={s.sectionTitle}
				/>
			</div>

			{/* LINKEDIN */}
			<div className={s.section}>
				<InputWidget
					title="LinkedIn"
					value={getProfileInfo(userModel, "linkedin")}
					placeholder="ex. https://www.linkedin.com/u/iljf"
					onChange={(value) => updateModel("linkedin", value)}
					titleClass={s.sectionTitle}
				/>
			</div>

			{/* DISCORD */}
			<div className={s.section}>
				<InputWidget
					title="Discord"
					value={getProfileInfo(userModel, "discord")}
					placeholder="ex. a0f#1231"
					onChange={(value) => updateModel("discord", value)}
					titleClass={s.sectionTitle}
				/>
			</div>

			{/* TELEGRAM */}
			<div className={s.section}>
				<InputWidget
					title="Telegram"
					value={getProfileInfo(userModel, "telegram")}
					placeholder="ex. @devtools"
					onChange={(value) => updateModel("telegram", value)}
					titleClass={s.sectionTitle}
				/>
			</div>

			{/* TWITTER */}
			<div className={s.section}>
				<InputWidget
					title="Twitter"
					value={getProfileInfo(userModel, "twitter")}
					placeholder="ex. @WeavechainWeb3"
					onChange={(value) => updateModel("twitter", value)}
					titleClass={s.sectionTitle}
					label="Enter your handle with or without the @ sign"
				/>
			</div>

			<div className={cx(s.section, s.buttons)}>
				<RoloButton text="Customize Profile Visibility" onClick={onSubmit} />
			</div>
		</div>
	);
}
