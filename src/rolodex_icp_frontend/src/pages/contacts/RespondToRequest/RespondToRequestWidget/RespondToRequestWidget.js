import React from "react";
import cx from "classnames";

import { getProfileInfo } from "../../../../helpers/Utils";

import s from "./RespondToRequestWidget.module.scss";

import ToggleWidget from "../../../../components/ToggleWidget/ToggleWidget";

import NameComputationWidget from "./fields/NameComputationWidget/NameComputationWidget";

import AddressComputationWidget from "./fields/AddressComputationWidget/AddressComputationWidget";
import BirthdayComputationWidget from "./fields/BirthdayComputationWidget/BirthdayComputationWidget";
import LookingForWidget from "./fields/LookingForWidget/LookingForWidget";
import MetamaskConnectButton from "../../../../components/metamask/MetamaskAccountWidget/MetamaskConnectButton";
import GenericFieldEditor from "./fields/GenericFieldEditor/GenericFieldEditor";

export default function RespondToRequestWidget({
	profile = {},
	requestedFields = [],
	updateProfile = () => {},
}) {
	const wallet = getProfileInfo(profile, "wallet");
	const lookingFor = profile.lookingFor;

	// ------------------------------------- METHODS -------------------------------------
	const updateVisibility = (key, show) => {
		const oldData = profile[key] || {};
		const model = {
			...profile,
			[key]: { ...oldData, show },
		};

		updateProfile(model);
	};

	return (
		<div className={s.root}>
			{/* AVATAR */}
			<GenericFieldEditor
				profile={profile}
				name="avatar"
				title="Profile Image"
				requestedFields={requestedFields}
				updateModel={updateProfile}
				updateVisibility={updateVisibility}
			/>

			{/* WALLET */}
			<div className={s.section}>
				<div className={s.sectionHeader}>
					<div
						className={cx(s.title, {
							[s.requested]: requestedFields.includes("wallet"),
						})}
					>
						Wallet Address
					</div>
					<ToggleWidget
						isVisible={profile?.wallet?.show === "true" || profile?.wallet?.show === true}
						onToggle={(val) => updateVisibility("wallet", val)}
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
			<GenericFieldEditor
				profile={profile}
				name="email"
				title="Email"
				placeholder="ex. smith@gmx.com"
				requestedFields={requestedFields}
				updateModel={updateProfile}
				updateVisibility={updateVisibility}
			/>

			{/* NAME */}
			<div className={s.section}>
				<NameComputationWidget
					profile={profile}
					updateModel={(name) => updateProfile({ ...profile, name })}
					titleClassName={requestedFields.includes("name") ? s.requested : ""}
				/>
			</div>

			{/* ADDRESS */}
			<div className={s.section}>
				<AddressComputationWidget
					profile={profile}
					updateModel={(address) => updateProfile({ ...profile, address })}
					titleClassName={
						requestedFields.includes("address") ? s.requested : ""
					}
				/>
			</div>

			{/* BIRTHDAY */}
			<div className={s.section}>
				<BirthdayComputationWidget
					profile={profile}
					updateModel={(birthday) => updateProfile({ ...profile, birthday })}
					titleClassName={
						requestedFields.includes("birthday") ? s.requested : ""
					}
				/>
			</div>

			{/* LOOKING FOR */}
			<div className={s.section}>
				<LookingForWidget
					data={lookingFor}
					titleClassName={
						requestedFields.includes("lookingFor") ? s.requested : ""
					}
					updateModel={(looking) =>
						updateProfile({ ...profile, lookingFor: looking })
					}
				/>
			</div>

			{/* SUSHI */}
			<GenericFieldEditor
				profile={profile}
				name="favorite_sushi"
				title="Favorite Sushi"
				placeholder="ex. salmon"
				requestedFields={requestedFields}
				updateModel={updateProfile}
				updateVisibility={updateVisibility}
			/>

			{/* JOB TITLE */}
			<GenericFieldEditor
				profile={profile}
				name="jobTitle"
				title="Job Title"
				placeholder="ex. accountant"
				requestedFields={requestedFields}
				updateModel={updateProfile}
				updateVisibility={updateVisibility}
			/>

			{/* COMPANY */}
			<GenericFieldEditor
				profile={profile}
				name="company"
				title="Company"
				placeholder="ex. salesforce"
				requestedFields={requestedFields}
				updateModel={updateProfile}
				updateVisibility={updateVisibility}
			/>

			{/* PHONE */}
			<GenericFieldEditor
				profile={profile}
				name="phone"
				title="Phone"
				placeholder="ex. 555-1234"
				requestedFields={requestedFields}
				updateModel={updateProfile}
				updateVisibility={updateVisibility}
			/>

			{/* LINKEDIN */}
			<GenericFieldEditor
				profile={profile}
				name="linkedin"
				title="Linkedin"
				placeholder="ex. linkedin.com/smith"
				requestedFields={requestedFields}
				updateModel={updateProfile}
				updateVisibility={updateVisibility}
			/>

			{/* DISCORD */}
			<GenericFieldEditor
				profile={profile}
				name="discord"
				title="Discord"
				placeholder="ex. @devtools"
				requestedFields={requestedFields}
				updateModel={updateProfile}
				updateVisibility={updateVisibility}
			/>

			{/* TELEGRAM */}
			<GenericFieldEditor
				profile={profile}
				name="telegram"
				title="Telegram"
				placeholder="ex. @smith"
				requestedFields={requestedFields}
				updateModel={updateProfile}
				updateVisibility={updateVisibility}
			/>

			{/* TWITTER */}
			<GenericFieldEditor
				profile={profile}
				name="twitter"
				title="twitter"
				placeholder="ex. @smith"
				requestedFields={requestedFields}
				updateModel={updateProfile}
				updateVisibility={updateVisibility}
			/>
		</div>
	);
}
