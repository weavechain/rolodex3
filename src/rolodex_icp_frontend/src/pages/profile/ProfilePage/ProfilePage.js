import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useMetaMask } from "metamask-react";

// ACTIONS
import {
	addUserToDirectory,
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

	const { CURRENT_DIRECTORY, CORE_PROFILE, CORE_DIRECTORY } = useSelector(
		(state) => state.directories
	);
	const profile = CURRENT_DIRECTORY?.profile || CORE_PROFILE;

	useEffect(() => {
		if (profile) {
			setCustomizeVisibility(!!CORE_PROFILE);
			setUserModel({ ...profile });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [profile]);

	useEffect(() => {
		if (account && !profile?.wallet) {
			setUserModel({ ...profile, wallet: { value: account, show: true } });
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

	const showDirectoriesDialog = () => {
		// If profile already set go to directory details
		if (CORE_PROFILE) {
			dispatch(addUserToDirectory(CURRENT_DIRECTORY, userModel)).then(() => {
				_goToDirectoryDetails(CURRENT_DIRECTORY);
			});
		} else {
			setShowDialog(true);
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
					onSubmit={showDirectoriesDialog}
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
