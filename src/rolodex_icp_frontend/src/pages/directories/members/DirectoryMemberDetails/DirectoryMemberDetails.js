import React from "react";
import cx from "classnames";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router";
import { useSelector } from "react-redux";

import s from "./DirectoryMemberDetails.module.scss";

import { getProfileInfo } from "../../../../helpers/Utils";
import { DISPLAY_FIELDS } from "../../../../helpers/AppHelper";

import AppConfig from "../../../../AppConfig";
import AppRoutes from "../../../../helpers/AppRoutes";
import AvatarWidget from "../../../../components/AvatarWidget/AvatarWidget";
import Header from "../../../../components/Header/Header";
import FavoriteIcon from "../../../../components/icons/FavoriteIcon";
import ExchangeIcon from "../../../../components/icons/ExchangeIcon";

export default function DirectoryMemberDetails() {
	const history = useHistory();
	const { id, memberId } = useParams() || {};

	const { directories = [] } = useSelector((state) => state.directories);
	const directory = directories.find((d) => d.id === id) || {};
	const allMembers = directory?.members || [];

	const member = allMembers.find((d) => d.id === memberId);

	if (!member) {
		history.push(AppRoutes.home);
		return null;
	}

	const visibleFields = [];
	DISPLAY_FIELDS.forEach(({ name, key }) => {
		visibleFields.push({
			name: name,
			value:
				key === "birthday"
					? member[key]?.displayText
					: key === "lookingFor"
					? member[key]?.value.join(", ")
					: member[key]?.value,
		});
	});

	// ------------------------------------- METHODS -------------------------------------

	return (
		<div className={s.root}>
			<Header title="Directory Profile" showBack>
				<div className={s.headerIcon}>
					<a href={`#${AppRoutes.exchangeInfo}/${member.id}`}>
						<ExchangeIcon />
					</a>
				</div>
			</Header>

			<div className={s.content}>
				{/* AVATAR */}
				{member?.avatar ? (
					<div className={s.section}>
						<div className={s.sectionBody}>
							<AvatarWidget avatar={member?.avatar.value} />
							<div className={cx(s.value, s.name)}>
								<span>{getProfileInfo(member, "name")}</span>
								{member.isContact ? <FavoriteIcon /> : null}
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
