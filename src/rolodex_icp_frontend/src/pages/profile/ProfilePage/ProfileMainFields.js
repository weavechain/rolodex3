import React from "react";
import cx from "classnames";
import { useMetaMask } from "metamask-react";
import { useHistory } from "react-router-dom";

import s from "./ProfilePage.module.scss";

import { getProfileInfo } from "../../../helpers/Utils";

import CountrySelector from "../../../components/selectors/CountrySelector/CountrySelector";
import DateTimePicker from "../../../components/DateTimePicker/DateTimePicker";
import InputWidget from "../../../components/InputWidget/InputWidget";
import LookingForSelector from "../../../components/selectors/LookingForSelector/LookingForSelector";
import UploadAvatarWidget from "../../../components/UploadAvatarWidget/UploadAvatarWidget";
import RoloButton from "../../../components/RoloButton/RoloButton";
import SushiSelector from "../../../components/selectors/SushiSelector/SushiSelector";
import MetamaskAccountWidget from "../../../components/metamask/MetamaskAccountWidget/MetamaskAccountWidget";
import AppRoutes from "../../../helpers/AppRoutes";

export default function ProfileMainFields({
	userModel,
	updateModel = () => {},
	onSubmit = () => {},
}) {
	const history = useHistory();
	const { account } = useMetaMask();

	// ------------------------------------- METHODS -------------------------------------
	const isValid = () => {
		return (
			(account ? true : userModel?.email?.value) && userModel?.nickname?.value
		);
	};

	const afterConnect = (account) => {
		history.push(AppRoutes.metamask);
	};

	return (
		<div className={s.content}>
			<div className={s.avatar}>
				<UploadAvatarWidget
					avatar={getProfileInfo(userModel, "avatar")}
					onUploadComplete={(data) => updateModel("avatar", data)}
				/>
			</div>

			{/* METAMASK */}
			<MetamaskAccountWidget callback={afterConnect} />

			{/* EMAIL */}
			<div className={s.section}>
				<InputWidget
					title="Email"
					isMandatory={!account}
					value={getProfileInfo(userModel, "email")}
					placeholder="ex. jim@me.com"
					onChange={(value) => updateModel("email", value)}
					titleClass={s.sectionTitle}
					validationRegex="^[^\s@]+@[^\s@]+\.[^\s@]{2,}$"
				/>
				<div className={s.sectionLabel}>
					Needed for login if you don’t connect with Metamask
				</div>
			</div>

			{/* NICKNAME */}
			<div className={s.section}>
				<InputWidget
					title="Nickname"
					isMandatory
					value={getProfileInfo(userModel, "nickname")}
					placeholder="ex. jim"
					onChange={(value) => updateModel("nickname", value)}
					titleClass={s.sectionTitle}
				/>
				<div className={s.sectionLabel}>
					You'll be able to be identified by nickname in directories
				</div>
			</div>

			{/* NAME */}
			<div className={s.twins}>
				<div className={s.sectionTitle}>Name</div>

				<div className={s.grid}>
					<div className={s.section}>
						<InputWidget
							value={getProfileInfo(userModel, "firstName")}
							placeholder="ex. Jim"
							onChange={(value) => updateModel("firstName", value)}
							titleClass={s.sectionTitle}
						/>
						<div className={s.sectionLabel}>First</div>
					</div>

					<div className={s.section}>
						<InputWidget
							value={getProfileInfo(userModel, "lastName")}
							placeholder="ex. Smith"
							onChange={(value) => updateModel("lastName", value)}
							titleClass={s.sectionTitle}
						/>
						<div className={s.sectionLabel}>Last</div>
					</div>
				</div>
			</div>

			{/* COUNTRY */}
			<div className={s.section}>
				<CountrySelector
					value={getProfileInfo(userModel, "country")}
					onSelect={(value) => updateModel("country", value)}
				/>
			</div>

			{/* BIRTHDAY */}
			<div className={s.section}>
				<div className={s.sectionTitle}>Birthday</div>

				<DateTimePicker
					selecteDate={getProfileInfo(userModel, "birthday")}
					onChange={(value) => updateModel("birthday", value)}
				/>
			</div>

			{/* LOOKING FOR */}
			<div className={s.section}>
				<LookingForSelector
					value={getProfileInfo(userModel, "lookingFor", [])}
					onSelect={(value) => updateModel("lookingFor", value)}
				/>
			</div>

			{/* SUSHI */}
			<div className={s.section}>
				<SushiSelector
					value={getProfileInfo(userModel, "favorite_sushi")}
					onSelect={(value) => updateModel("favorite_sushi", value)}
				/>
			</div>

			<div className={cx(s.section, s.buttons)}>
				<RoloButton
					text="Next"
					disabled={!isValid()}
					onClick={onSubmit}
					className={s.button}
				/>
			</div>
		</div>
	);
}
