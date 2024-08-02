import React from "react";
import cx from "classnames";

import { getDirectoryProfileInfo, getProfileInfo } from "../../helpers/Utils";

import s from "./ProfileVisibilityWidget.module.scss";

import AppConfig from "../../AppConfig";

import ToggleWidget from "../../components/ToggleWidget/ToggleWidget";
import AvatarWidget from "../../components/AvatarWidget/AvatarWidget";
import NameComputationWidget from "./fields/NameComputationWidget/NameComputationWidget";
import JobTitleWidget from "./fields/JobTitleWidget/JobTitleWidget";
import CompanyWidget from "./fields/CompanyWidget/CompanyWidget";
import AddressComputationWidget from "./fields/AddressComputationWidget/AddressComputationWidget";
import BirthdayComputationWidget from "./fields/BirthdayComputationWidget/BirthdayComputationWidget";
import LookingForWidget from "./fields/LookingForWidget/LookingForWidget";
import MetamaskConnectButton from "../metamask/MetamaskAccountWidget/MetamaskConnectButton";

export default function ProfileVisibilityWidget({
	directoryProfile = {},
	directory,
	updateProfile = () => { },
}) {
	const email = getDirectoryProfileInfo(directoryProfile, "email");
	const wallet = getDirectoryProfileInfo(directoryProfile, "wallet");
	const twitterHandle = getDirectoryProfileInfo(directoryProfile, "twitter");
	const linkedinUrl = getDirectoryProfileInfo(directoryProfile, "linkedin");
	const sushi = getDirectoryProfileInfo(directoryProfile, "favorite_sushi");
	const phone = getDirectoryProfileInfo(directoryProfile, "phone");
	const telegram = getDirectoryProfileInfo(directoryProfile, "telegram");
	const discord = getDirectoryProfileInfo(directoryProfile, "discord");
	const lookingFor = directoryProfile.lookingFor;
	const jobTitle = directoryProfile.jobTitle;

	// ------------------------------------- METHODS -------------------------------------
	const updateVisibility = (key, show) => {
		const oldData = directoryProfile[key] || {};
		const model = {
			...directoryProfile,
			[key]: { ...oldData, show },
		};

		updateProfile(model);
	};

	return (
		<div className={s.root}>
			<div className={s.infoCard}>
				<p className={s.value}>Choose what to share with this directory</p>
				<p className={s.text}>You can update these settings at any time.</p>
				{directory ? (
					<p className={s.text}>
						You can add new details to show or hide by editing your Core
						Profile.
					</p>
				) : (
					<p className={s.text}>
						You can add new details to show or hide by editing your Core
						Profile.
					</p>
				)}
			</div>

			{/* AVATAR */}
			<div className={s.section}>
				<div className={s.sectionHeader}>
					<div className={s.title}>Profile Image</div>
					<ToggleWidget
						isVisible={directoryProfile?.avatar?.show}
						onToggle={(val) => updateVisibility("avatar", val)}
					/>
				</div>
				<div className={s.sectionText}>
					<AvatarWidget avatar={getProfileInfo(directoryProfile, "avatar")} />
				</div>
			</div>

			{/* WALLET */}
			<div className={s.section}>
				<div className={s.sectionHeader}>
					<div className={s.title}>Wallet Address</div>
					<ToggleWidget
						isVisible={directoryProfile?.wallet?.show}
						onToggle={(val) => {
							if (wallet)
								updateVisibility("wallet", val)
						}}
					/>
				</div>
				{!wallet ? (
					<MetamaskConnectButton
						hideInfo
						callback={(wallet) =>
							updateProfile({
								...directoryProfile,
								wallet: { value: wallet, show: true },
							})
						}
					/>
				) : (
					<div
						className={cx(s.sectionText, s.wallet, {
							[s.restricted]: !directoryProfile?.wallet?.show,
						})}
					>
						{wallet}
					</div>
				)}
			</div>

			{/* EMAIL */}
			{email ? (
				<div className={s.section}>
					<div className={s.sectionHeader}>
						<div className={s.title}>Email</div>
						<ToggleWidget
							isVisible={directoryProfile?.email?.show}
							onToggle={(val) => updateVisibility("email", val)}
						/>
					</div>
					<div
						className={cx(s.sectionText, s.email, {
							[s.restricted]: !directoryProfile?.email?.show,
						})}
					>
						<a href={`mailto:${email}`}>{email}</a>
					</div>
				</div>
			) : null}

			{/* NAME */}
			<div className={s.section}>
				<NameComputationWidget
					profile={directoryProfile}
					updateModel={(name) => updateProfile({ ...directoryProfile, name })}
				/>
			</div>

			{/* ADDRESS */}
			{directoryProfile.country ? (
				<div className={s.section}>
					<AddressComputationWidget
						profile={directoryProfile}
						updateModel={(address) => updateProfile({ ...directoryProfile, address })}
					/>
				</div>
			) : null}

			{/* BIRTHDAY */}
			{directoryProfile.birthday ? (
				<div className={s.section}>
					<BirthdayComputationWidget
						profile={directoryProfile}
						updateModel={(birthday) => updateProfile({ ...directoryProfile, birthday })}
					/>
				</div>
			) : null}

			{/* LOOKING FOR */}
			{lookingFor ? (
				<div className={s.section}>
					<LookingForWidget
						data={lookingFor}
						updateModel={(looking) =>
							updateProfile({ ...directoryProfile, lookingFor: looking })
						}
					/>
				</div>
			) : null}

			{/* SUSHI */}
			{sushi ? (
				<div className={s.section}>
					<div className={s.sectionHeader}>
						<div className={s.title}>Favorite Sushi</div>
						<ToggleWidget
							isVisible={directoryProfile?.favorite_sushi?.show === true || directoryProfile?.favorite_sushi?.show === "true"}
							onToggle={(val) => updateVisibility("favorite_sushi", val)}
						/>
					</div>
					<div
						className={cx(s.sectionText, {
							[s.restricted]: !directoryProfile?.favorite_sushi?.show,
						})}
					>
						{sushi}
					</div>
				</div>
			) : null}

			{/* JOB TITLE */}
			{jobTitle ? (
				<div className={s.section}>
					<JobTitleWidget
						data={jobTitle}
						updateModel={(job) => updateProfile({ ...directoryProfile, jobTitle: job })}
					/>
				</div>
			) : null}

			{/* COMPANY */}
			<div className={s.section}>
				<CompanyWidget
					data={directoryProfile?.company}
					updateModel={(company) => updateProfile({ ...directoryProfile, company })}
				/>
			</div>

			{/* PHONE */}
			{phone ? (
				<div className={s.section}>
					<div className={s.sectionHeader}>
						<div className={s.title}>Phone</div>
						<ToggleWidget
							isVisible={directoryProfile?.phone?.show}
							onToggle={(val) => updateVisibility("phone", val)}
						/>
					</div>
					<div
						className={cx(s.sectionText, {
							[s.restricted]: !directoryProfile?.phone?.show,
						})}
					>
						{phone}
					</div>
				</div>
			) : null}

			{/* LINKEDIN */}
			{linkedinUrl ? (
				<div className={s.section}>
					<div className={s.sectionHeader}>
						<div className={s.title}>LinkedIn</div>
						<ToggleWidget
							isVisible={directoryProfile?.linkedin?.show}
							onToggle={(val) => updateVisibility("linkedin", val)}
						/>
					</div>
					<div
						className={cx(s.sectionText, s.blue, {
							[s.restricted]: !directoryProfile?.linkedin?.show,
						})}
					>
						<a href={linkedinUrl} target="_blank" rel="noreferrer">
							{linkedinUrl}
						</a>
					</div>
				</div>
			) : null}

			{/* DISCORD */}
			{discord ? (
				<div className={s.section}>
					<div className={s.sectionHeader}>
						<div className={s.title}>Discord</div>
						<ToggleWidget
							isVisible={directoryProfile?.discord?.show}
							onToggle={(val) => updateVisibility("discord", val)}
						/>
					</div>
					<div
						className={cx(s.sectionText, {
							[s.restricted]: !directoryProfile?.discord?.show,
						})}
					>
						{discord}
					</div>
				</div>
			) : null}

			{/* TELEGRAM */}
			{telegram ? (
				<div className={s.section}>
					<div className={s.sectionHeader}>
						<div className={s.title}>Telegram</div>
						<ToggleWidget
							isVisible={directoryProfile?.telegram?.show}
							onToggle={(val) => updateVisibility("telegram", val)}
						/>
					</div>
					<div
						className={cx(s.sectionText, {
							[s.restricted]: !directoryProfile?.telegram?.show,
						})}
					>
						{telegram}
					</div>
				</div>
			) : null}

			{/* TWITTER */}
			{twitterHandle ? (
				<div className={s.section}>
					<div className={s.sectionHeader}>
						<div className={s.title}>Twitter</div>
						<ToggleWidget
							isVisible={directoryProfile?.twitter?.show && (directoryProfile?.twitter?.show === "true" || directoryProfile?.twitter?.show === true)}
							onToggle={(val) => updateVisibility("twitter", val)}
						/>
					</div>
					<div
						className={cx(s.sectionText, {
							[s.restricted]: !directoryProfile?.twitter?.show,
						})}
					>
						<a href={`${AppConfig.TWITTER_URL}${twitterHandle}`}>
							{twitterHandle}
						</a>
					</div>
				</div>
			) : null}
		</div>
	);
}
