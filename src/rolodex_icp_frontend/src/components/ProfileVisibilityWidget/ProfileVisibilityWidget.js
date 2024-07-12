import React from "react";
import cx from "classnames";

import { getProfileInfo } from "../../helpers/Utils";

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
	profile = {},
	directory,
	updateProfile = () => { },
}) {
	const email = getProfileInfo(profile, "email");
	const wallet = getProfileInfo(profile, "wallet");
	const twitterHandle = getProfileInfo(profile, "twitter");
	const linkedinUrl = getProfileInfo(profile, "linkedin");
	const sushi = getProfileInfo(profile, "favorite_sushi");
	const phone = getProfileInfo(profile, "phone");
	const telegram = getProfileInfo(profile, "telegram");
	const discord = getProfileInfo(profile, "discord");
	const lookingFor = profile.lookingFor;
	const jobTitle = profile.jobTitle;

	// ------------------------------------- METHODS -------------------------------------
	const updateVisibility = (key, show) => {
		show = show + ""
		const oldData = profile[key] || {};
		const model = {
			...profile,
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
						isVisible={profile?.avatar?.show}
						onToggle={(val) => updateVisibility("avatar", val)}
					/>
				</div>
				<div className={s.sectionText}>
					<AvatarWidget avatar={getProfileInfo(profile, "avatar")} />
				</div>
			</div>

			{/* WALLET */}
			<div className={s.section}>
				<div className={s.sectionHeader}>
					<div className={s.title}>Wallet Address</div>
					<ToggleWidget
						isVisible={profile?.wallet?.show === "true" || profile?.wallet?.show === true }
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
								...profile,
								wallet: { value: wallet, show: true },
							})
						}
					/>
				) : (
					<div
						className={cx(s.sectionText, s.wallet, {
							[s.restricted]: !profile?.wallet?.show,
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
							isVisible={profile?.email?.show}
							onToggle={(val) => updateVisibility("email", val)}
						/>
					</div>
					<div
						className={cx(s.sectionText, s.email, {
							[s.restricted]: !profile?.email?.show,
						})}
					>
						<a href={`mailto:${email}`}>{email}</a>
					</div>
				</div>
			) : null}

			{/* NAME */}
			<div className={s.section}>
				<NameComputationWidget
					profile={profile}
					updateModel={(name) => updateProfile({ ...profile, name })}
				/>
			</div>

			{/* ADDRESS */}
			{profile.country ? (
				<div className={s.section}>
					<AddressComputationWidget
						profile={profile}
						updateModel={(address) => updateProfile({ ...profile, address })}
					/>
				</div>
			) : null}

			{/* BIRTHDAY */}
			{profile.birthday ? (
				<div className={s.section}>
					<BirthdayComputationWidget
						profile={profile}
						updateModel={(birthday) => updateProfile({ ...profile, birthday })}
					/>
				</div>
			) : null}

			{/* LOOKING FOR */}
			{lookingFor ? (
				<div className={s.section}>
					<LookingForWidget
						data={lookingFor}
						updateModel={(looking) =>
							updateProfile({ ...profile, lookingFor: looking })
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
							isVisible={profile?.favorite_sushi?.show === true || profile?.favorite_sushi?.show === "true"}
							onToggle={(val) => updateVisibility("favorite_sushi", val)}
						/>
					</div>
					<div
						className={cx(s.sectionText, {
							[s.restricted]: !profile?.favorite_sushi?.show,
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
						updateModel={(job) => updateProfile({ ...profile, jobTitle: job })}
					/>
				</div>
			) : null}

			{/* COMPANY */}
			<div className={s.section}>
				<CompanyWidget
					data={profile?.company}
					updateModel={(company) => updateProfile({ ...profile, company })}
				/>
			</div>

			{/* PHONE */}
			{phone ? (
				<div className={s.section}>
					<div className={s.sectionHeader}>
						<div className={s.title}>Phone</div>
						<ToggleWidget
							isVisible={profile?.phone?.show}
							onToggle={(val) => updateVisibility("phone", val)}
						/>
					</div>
					<div
						className={cx(s.sectionText, {
							[s.restricted]: !profile?.phone?.show,
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
							isVisible={profile?.linkedin?.show}
							onToggle={(val) => updateVisibility("linkedin", val)}
						/>
					</div>
					<div
						className={cx(s.sectionText, s.blue, {
							[s.restricted]: !profile?.linkedin?.show,
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
							isVisible={profile?.discord?.show}
							onToggle={(val) => updateVisibility("discord", val)}
						/>
					</div>
					<div
						className={cx(s.sectionText, {
							[s.restricted]: !profile?.discord?.show,
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
							isVisible={profile?.telegram?.show}
							onToggle={(val) => updateVisibility("telegram", val)}
						/>
					</div>
					<div
						className={cx(s.sectionText, {
							[s.restricted]: !profile?.telegram?.show,
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
							isVisible={profile?.twitter?.show && (profile?.twitter?.show === "true" || profile?.twitter?.show === true)}
							onToggle={(val) => updateVisibility("twitter", val)}
						/>
					</div>
					<div
						className={cx(s.sectionText, {
							[s.restricted]: !profile?.twitter?.show,
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
