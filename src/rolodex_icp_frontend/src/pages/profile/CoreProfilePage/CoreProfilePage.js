import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useMetaMask } from "metamask-react";

import { updateCoreProfile } from "../../../_redux/actions/directories";
import { getProfileInfo } from "../../../helpers/Utils";

import s from "./CoreProfilePage.module.scss";

import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import AppRoutes from "../../../helpers/AppRoutes";
import UploadAvatarWidget from "../../../components/UploadAvatarWidget/UploadAvatarWidget";
import MetamaskAccountWidget from "../../../components/metamask/MetamaskAccountWidget/MetamaskAccountWidget";
import ProfileEmail from "./fields/ProfileEmail";
import ProfileName from "./fields/ProfileName";
import ProfileNickName from "./fields/ProfileNickName";
import ProfileBirthday from "./fields/ProfileBirthday";
import ProfileGenericField from "./fields/ProfileGenericField";
import ProfileCountry from "./fields/ProfileCountry";
import ProfileLookingFor from "./fields/ProfileLookingFor";
import ProfileSushi from "./fields/ProfileSushi";

export default function CoreProfilePage() {
	const dispatch = useDispatch();

	const { account } = useMetaMask();

	const history = useHistory();
	const [userModel, setUserModel] = useState({});
	const [isEditMode, setIsEditMode] = useState(false);

	const coreProfile = useSelector(state => state.user.coreProfile);

	useEffect(() => {
		if (!coreProfile) {
			return;
		}
		setUserModel(coreProfile);
	}, [coreProfile]);

	// ------------------------------------- METHODS -------------------------------------
	const updateModel = (key, value) => {
		setIsEditMode(true);

		const userData = {
			...userModel,
			[key]: value
		};

		setUserModel(userData);
	};

	const goBack = () => {
		history.goBack();
	};

	const isValid = () => {
		return (
			(account ? true : userModel?.email) && userModel?.nickname
		);
	};

	const saveChanges = () => {
		if (!isValid()) return;

		setIsEditMode(false);
		dispatch(updateCoreProfile(userModel));
	};

	return (
		<div className={s.root}>
			{isEditMode ? (
				<Header title="Edit Profile" goBack={goBack}>
					<div className={s.saveText} onClick={saveChanges}>
						Save Changes
					</div>
				</Header>
			) : (
				<Header title="Core Profile" showBack />
			)}

			<div className={s.content}>
				{/* VIEW AS */}
				{/* <ViewAsWidget /> */}

				<div className={s.avatar}>
					<UploadAvatarWidget
						avatar={getProfileInfo(userModel, "avatar")}
						onUploadComplete={(data) => updateModel("avatar", data)}
					/>
				</div>

				{/* METAMASK */}
				<MetamaskAccountWidget
					hideInfo
					callback={(wallet) => updateModel("wallet", wallet)}
				/>

				{/* EMAIL */}
				<ProfileEmail
					metamaskAccount={account}
					profile={userModel}
					showEdit={isEditMode}
					updateModel={updateModel}
				/>

				{/* NICKNAME */}
				<ProfileNickName
					profile={userModel}
					metamaskAccount={account}
					updateModel={updateModel}
					showEdit={isEditMode}
				/>

				{/* NAME */}
				<ProfileName
					profile={userModel}
					updateModel={updateModel}
					showEdit={isEditMode}
				/>

				{/* BIRTHDAY */}
				<ProfileBirthday
					profile={userModel}
					updateModel={updateModel}
					showEdit={isEditMode}
				/>

				{/* CITY */}
				<ProfileGenericField
					profile={userModel}
					name="city"
					title="City"
					placeholder="City"
					updateModel={updateModel}
					showEdit={isEditMode}
				/>

				{/* COUNTRY */}
				<ProfileCountry
					profile={userModel}
					updateModel={updateModel}
					showEdit={isEditMode}
				/>

				{/* JOB TITLE */}
				<ProfileGenericField
					profile={userModel}
					name="jobTitle"
					title="Job Title"
					placeholder="Job Title"
					updateModel={updateModel}
					showEdit={isEditMode}
				/>

				{/* Company */}
				<ProfileGenericField
					profile={userModel}
					name="company"
					title="Company"
					placeholder="Company"
					updateModel={updateModel}
					showEdit={isEditMode}
				/>

				{/* LOOKING FOR */}
				<ProfileLookingFor
					profile={userModel}
					updateModel={updateModel}
					showEdit={isEditMode}
				/>

				{/* LOOKING FOR */}
				<ProfileSushi
					profile={userModel}
					updateModel={updateModel}
					showEdit={isEditMode}
				/>

				{/* PHONE */}
				<ProfileGenericField
					profile={userModel}
					name="phone"
					title="Phone"
					placeholder="ex. 555-1234"
					updateModel={updateModel}
					showEdit={isEditMode}
				/>

				{/* LINKEDIN */}
				<ProfileGenericField
					profile={userModel}
					name="linkedin"
					title="LinkedIn"
					placeholder="LinkedIn"
					updateModel={updateModel}
					showEdit={isEditMode}
				/>

				{/* DISCORD */}
				<ProfileGenericField
					profile={userModel}
					name="discord"
					title="Discord"
					updateModel={updateModel}
					showEdit={isEditMode}
				/>

				{/* TELEGRAM */}
				<ProfileGenericField
					profile={userModel}
					name="telegram"
					title="Telegram"
					placeholder="ex. 555-1234"
					updateModel={updateModel}
					showEdit={isEditMode}
				/>

				{/* TELEGRAM */}
				<ProfileGenericField
					profile={userModel}
					name="twitter"
					title="Twitter"
					placeholder="ex. Jim"
					updateModel={updateModel}
					showEdit={isEditMode}
				/>
			</div>

			<Footer page={AppRoutes.coreProfile} showFooter />
		</div>
	);
}
