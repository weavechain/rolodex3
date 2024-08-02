import React from "react";
import cx from "classnames";

import { DISPLAY_FIELDS } from "../../helpers/AppHelper";

import s from "./ProfileViewWidget.module.scss";

import AvatarWidget from "../../components/AvatarWidget/AvatarWidget";
import AppConfig from "../../AppConfig";
import InfoCard from "../InfoCard/InfoCard";
import { getDirectoryProfileInfo, getProfileInfo } from "../../helpers/Utils";

// noShowSubfield
// if true -> profile doens't have show=true/false on each field. Fields are plain primitive types
// if false -> profile looks like: "wallet": {value: 0x123..., show: true/false}
export default function ProfileViewWidget({ directory, profile = {}, isNested }) {
	if (!profile) return null;

	const visibleFields = [];
	DISPLAY_FIELDS.forEach(({ name, key }) => {
		if (profile[key]) {
			if (isNested) {
				if (profile[key].show) {
					let skipBecauseNickname = (key === "firstName" || key === "lastName") && profile["name"]?.show === "nickname";
					if (!skipBecauseNickname) {
						let value = profile[key].value;
						if (key === "address")
							value = profile[key].value;
						else if (key === "lookingFor")
							value = profile[key].value.join(', ')
						else if (key === "birthday")
							value = profile[key].displayText
						visibleFields.push({
							name: name,
							value: value
						});
					}
				}
			} else {
				let add = true;
				let value = profile[key];
				if (key === "address")
					value = profile[key];
				else if (key === "lookingFor")
					value = profile[key].join(', ')
				else if (key === "birthday") {
					if (profile[key].displayText)
						value = profile[key].displayText;
					else if (typeof profile[key] !== "object") {
						value = profile[key];
					} else {
						add = false;
					}
				}
				if (add)
					visibleFields.push({
						name: name,
						value: value
					});
			}
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
								{isNested ? getDirectoryProfileInfo(profile, "nickname") : getProfileInfo(profile, "nickname")}
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
