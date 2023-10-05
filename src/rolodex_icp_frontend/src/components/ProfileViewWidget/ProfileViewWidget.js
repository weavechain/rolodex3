import React from "react";
import cx from "classnames";

import { getProfileInfo } from "../../helpers/Utils";
import { DISPLAY_FIELDS } from "../../helpers/AppHelper";

import s from "./ProfileViewWidget.module.scss";

import AvatarWidget from "../../components/AvatarWidget/AvatarWidget";
import AppConfig from "../../AppConfig";
import InfoCard from "../InfoCard/InfoCard";

export default function ProfileViewWidget({ directory, profile = {} }) {
	if (!profile) return null;

	const visibleFields = [];
	DISPLAY_FIELDS.forEach(({ name, key }) => {
		if (
			(!!profile[key]?.show && profile[key]?.show !== "hide") ||
			(key === "directories" && profile[key])
		) {
			visibleFields.push({
				name: name,
				value:
					key === "directories"
						? (profile[key] || []).join(", ")
						: key === "birthday"
						? profile[key]?.displayText
						: key === "lookingFor"
						? profile[key]?.value.join(", ")
						: profile[key]?.value,
			});
		}
	});

	return (
		<div className={s.root}>
			{directory ? (
				<InfoCard
					title="Preview Profile"
					description={`This is how your profile appears to all members of the directory ${directory.name}`}
				/>
			) : null}

			<div className={s.details}>
				{/* AVATAR */}
				{profile?.avatar?.show || profile?.avatar?.show === undefined ? (
					<div className={s.section}>
						<div className={s.sectionBody}>
							<AvatarWidget avatar={profile?.avatar?.value} />
							<div className={cx(s.value, s.name)}>
								{getProfileInfo(profile, "nickname")}
							</div>
						</div>
					</div>
				) : null}

				{visibleFields.map(({ name, value }, index) => (
					<div className={s.section} key={index}>
						<div className={s.label}>{name}</div>
						<div
							className={cx(s.value, {
								[s.blue]: name === "LinkedIn" || name === "Twitter",
							})}
						>
							{name === "LinkedIn" ? (
								<a href={value} target="_blank" rel="noreferrer">
									{value}
								</a>
							) : name === "Email" ? (
								<a href={`mailto:${value}`}>{value}</a>
							) : name === "Twitter" ? (
								<a href={`${AppConfig.TWITTER_URL}${value}`}>{value}</a>
							) : (
								<>{value}</>
							)}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
