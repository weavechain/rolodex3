import React, { useEffect, useState } from "react";
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
import RoloButton from "../../../../components/RoloButton/RoloButton";
import { addContactToDb, checkIsContact } from "../../../../_redux/actions/contacts";

export default function DirectoryMemberDetails() {
	const history = useHistory();

	const member = useSelector(state => state.contacts.CURRENT_CONTACT);
	const userId = useSelector(state => state.user?.coreProfile?.userId);

	const [isContact, setIsContact] = useState(false);
	const isMe = member.userId === userId;

	useEffect(() => {
		checkAndSetIsContact();
	}, []);

	// TODO: modal dialog with redirect options
	const [showModalDialog, setShowModalDialog] = useState(false);

	if (!member) {
		history.push(AppRoutes.home);
		return null;
	}

	const visibleFields = [];
	DISPLAY_FIELDS.forEach(({ name, key }) => {
		if (member[key]) {
			visibleFields.push({
				name: name,
				value: member[key]
			});
		}
	});

	const checkAndSetIsContact = () => {
		checkIsContact(userId, member.userId)
			.then(r => setIsContact(r));
	}

	const addContact = () => {
		addContactToDb(userId, member.userId, member.directoryId)
			.then(() => checkAndSetIsContact());
	}

	// ------------------------------------- METHODS -------------------------------------

	return (
		<div className={s.root}>
			<Header title="Directory Profile" showBack />

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
							) : name === "Birthday" ? (
								<>{value.displayText}</>
							) : name === "Looking For" ? (
								<>{value.join(", ")}</>
							) : (
								<>{value}</>
							)}
						</div>
					</div>
				))}
				{/* todo: show if not contact already */}
				{
					isContact || isMe
						? null
						: <RoloButton
							text="Add Contact"
							className={s.button}
							onClick={() => addContact()}
							noIcon
						/>
				}
			</div>
		</div>
	);
}
