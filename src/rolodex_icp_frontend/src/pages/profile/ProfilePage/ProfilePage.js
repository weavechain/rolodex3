import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useMetaMask } from "metamask-react";

// ACTIONS
import {
	addUserToDirectory,
	createUser,
	setCoreProfile,
} from "../../../_redux/actions/directories";

import s from "./ProfilePage.module.scss";

import Header from "../../../components/Header/Header";
import AppRoutes from "../../../helpers/AppRoutes";
import ProfileOptionalFields from "./ProfileOptionalFields";
import ProfileMainFields from "./ProfileMainFields";
import ProfileVisibilityPage from "../ProfileVisibilityPage/ProfileVisibilityPage";
import ProfilePreviewPage from "../ProfilePreviewPage/ProfilePreviewPage";
import JoinDirectoryDialog from "../../../components/JoinDirectoryDialog/JoinDirectoryDialog";

export default function ProfilePage() {
	const { account } = useMetaMask();

	const dispatch = useDispatch();
	const history = useHistory();
	const [userModel, setUserModel] = useState({});
	const [showOptional, setShowOptional] = useState(false);
	const [customizeVisibility, setCustomizeVisibility] = useState(false);
	const [showPreview, setShowPreview] = useState(false);
	const [showDialog, setShowDialog] = useState(false);

	const reduxDirectories = useSelector(state => state.directories);
	const CORE_DIRECTORY = reduxDirectories.directories.filter(d => d.is_core_directory === 1)[0];
	const CURRENT_DIRECTORY = reduxDirectories.CURRENT_DIRECTORY;
	const CORE_PROFILE = useSelector(state => state.user);
	const profile = CORE_PROFILE.user;

	useEffect(() => {
		if (profile) {
			setCustomizeVisibility(!!CORE_PROFILE);
			setUserModel({ ...profile, }); // ...hackyUserModel
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [profile]);

	useEffect(() => {
		if (account && !profile?.wallet) {
			setUserModel({ ...profile, wallet: { value: account, show: true } }); //, ...hackyUserModel
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [account]);

	// ------------------------------------- METHODS -------------------------------------
	const updateModel = (key, value) => {
		const oldData = userModel[key] || {};

		const userData = {
			...userModel,
			[key]: {
				...oldData,
				value,
				show: true,
			},
		};

		setUserModel(userData);
	};

	const _goToDirectoryDetails = (directory) => {
		history.push({
			pathname: `${AppRoutes.directories}/${directory.id}`,
			state: {
				from: "onboarding", // need this for the Back Button on directory details
			},
		});
	};

	const viewDashboard = () => {
		dispatch(setCoreProfile(CORE_DIRECTORY, userModel)).then(() => {
			history.push(AppRoutes.home);
		});
	};

	const joinWEVDirectory = () => {
		dispatch(setCoreProfile(CORE_DIRECTORY, userModel)).then(() => {
			_goToDirectoryDetails(CURRENT_DIRECTORY);
		});
	};

	const goBack = () => {
		if (showOptional) {
			setShowOptional(false);
		} else if (history.location.state?.from === "waiting") {
			history.push("/welcome");
		} else {
			history.goBack();
		}
	};

	const exitVisibility = () => {
		// Dont show edit fields for other directory
		if (CURRENT_DIRECTORY.id !== CORE_DIRECTORY?.id) {
			history.goBack();
		} else {
			setCustomizeVisibility(false);
		}
	};

	const goToPreview = (visibileModel) => {
		setUserModel(visibileModel);
		setShowPreview(true);
	};

	const joinDirectory = () => {
		// If profile already set go to directory details
		if (CORE_PROFILE.user) {
			dispatch(addUserToDirectory(CURRENT_DIRECTORY.id, userModel))
				.then(() => _goToDirectoryDetails(CURRENT_DIRECTORY));
		} else {
			dispatch(createUser(CURRENT_DIRECTORY.id, userModel))
				.then(() => setShowDialog(true));
		}
	};

	return (
		<>
			{showDialog ? (
				<JoinDirectoryDialog
					viewDashboard={viewDashboard}
					joinDirectory={joinWEVDirectory}
					onCancel={() => setShowDialog(false)}
				/>
			) : null}

			{showPreview ? (
				<ProfilePreviewPage
					profile={userModel}
					onSubmit={joinDirectory}
					onBack={() => setShowPreview(false)}
				/>
			) : customizeVisibility ? (
				<ProfileVisibilityPage
					directory={
						CURRENT_DIRECTORY.id !== CORE_DIRECTORY?.id ||
							!CORE_DIRECTORY.profile
							? CURRENT_DIRECTORY
							: null
					}
					profile={userModel}
					onSubmit={goToPreview}
					onBack={exitVisibility}
				/>
			) : (
				<div className={s.root}>
					<Header title="Set up New Account" goBack={goBack} />

					{showOptional ? (
						<ProfileOptionalFields
							userModel={userModel}
							updateModel={updateModel}
							onSubmit={() => setCustomizeVisibility(true)}
							goBack={() => setShowOptional(false)}
						/>
					) : (
						<ProfileMainFields
							userModel={userModel}
							updateModel={updateModel}
							onSubmit={() => setShowOptional(true)}
						/>
					)}
				</div>
			)}
		</>
	);
}
