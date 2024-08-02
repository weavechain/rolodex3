import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useMetaMask } from "metamask-react";

// ACTIONS
import {
	addUserToDirectory,
	createCoreProfile,
	setCurrentDirectory,
} from "../../../_redux/actions/directories";

import s from "./ProfilePage.module.scss";

import Header from "../../../components/Header/Header";
import AppRoutes from "../../../helpers/AppRoutes";
import ProfileOptionalFields from "./ProfileOptionalFields";
import ProfileMainFields from "./ProfileMainFields";
import ProfileVisibilityPage from "../ProfileVisibilityPage/ProfileVisibilityPage";
import ProfilePreviewPage from "../ProfilePreviewPage/ProfilePreviewPage";
import JoinDirectoryDialog from "../../../components/JoinDirectoryDialog/JoinDirectoryDialog";
import { ActionTypes } from "../../../_redux/constants";

// For creating new DirectoryProfile
// If no core profile, then first fill fields for it
export default function ProfilePage() {
	const { account } = useMetaMask();

	const dispatch = useDispatch();
	const history = useHistory();

	// for creating new Core Profile altogether
	const [coreProfileModel, setCoreProfileModel] = useState({});
	// will be the directory profile
	// TODO: if there's a CORE_PROFILE -> populate directory profile
	const [directoryProfile, setDirectoryProfile] = useState({});

	const [showOptional, setShowOptional] = useState(false);
	const [customizeVisibility, setCustomizeVisibility] = useState(false);
	const [showPreview, setShowPreview] = useState(false);
	const [showDialog, setShowDialog] = useState(false);

	const reduxDirectories = useSelector(state => state.directories);
	const CURRENT_DIRECTORY = reduxDirectories.CURRENT_DIRECTORY;
	const CORE_PROFILE = useSelector(state => state.user.coreProfile);

	const coreProfileBuilder = useSelector(state => state.user.coreProfileBuilder);

	useEffect(() => {
		if (!CURRENT_DIRECTORY) {
			const coreDirectory = reduxDirectories.directories ? reduxDirectories.directories[0] : {};
			// TODO: Set current directory WEV
			dispatch(setCurrentDirectory(coreDirectory));
		}
	}, []);

	useEffect(() => {
		if (CORE_PROFILE) {
			setCustomizeVisibility(true);
			setCoreProfileModel({ ...CORE_PROFILE, });
			// TODO: populate and set directoryProfile
			return;
		}
		if (coreProfileBuilder) {
			setCoreProfileModel(coreProfileBuilder);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [CORE_PROFILE, coreProfileBuilder]);

	useEffect(() => {
		if (account && !CORE_PROFILE) {
			setCoreProfileModel({ ...coreProfileModel, wallet: account });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [account]);

	// ------------------------------------- METHODS -------------------------------------
	const updateCoreProfileModel = (key, value) => {
		const newCoreProfile = {
			...coreProfileModel,
			[key]: value
		};
		setCoreProfileModel(newCoreProfile);
	};

	const _goToDirectoryDetails = (directory) => {
		history.push({
			pathname: `${AppRoutes.directories}/${directory.directoryId}`,
			state: {
				from: "onboarding", // need this for the Back Button on directory details
			},
		});
	};

	const viewDashboard = () => {
		history.push(AppRoutes.home);
	};

	const _setCustomizeVisibility = (flag) => {
		dispatch({
			type: ActionTypes.SET_CORE_PROFILE_BUILDER,
			coreProfileBuilder: coreProfileModel
		})
		setCustomizeVisibility(flag);
	}

	const joinWEVDirectory = () => {
		_goToDirectoryDetails(CURRENT_DIRECTORY);
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
		setCustomizeVisibility(false);
		// history.goBack();
	};

	const goToPreview = (coreProfile, directoryProfile) => {
		setCoreProfileModel(coreProfile);
		setDirectoryProfile(directoryProfile);
		setShowPreview(true);
	};

	const computeDirProfileBirthday = (visibleBirthday) => {
		if (!visibleBirthday.show && !visibleBirthday.compute)
			return null;

		let profileBirthday = {compute: false};
		if (visibleBirthday.show)
			profileBirthday["displayText"] = visibleBirthday.displayText;

		if (visibleBirthday.compute || visibleBirthday.displayText.includes(","))
			profileBirthday["compute"] = true;

		return profileBirthday;
	}

	const joinDirectory = () => {
		let stripped = {};
		for (const kv of Object.entries(directoryProfile)) {
			if (kv[1].show)
				stripped[kv[0]] = kv[1].value

			if (kv[0] === "birthday")
				stripped["birthday"] = computeDirProfileBirthday(kv[1]);
		}
		if (directoryProfile.name?.show === "nickname") {
			stripped["firstName"] = null;
			stripped["lastName"] = null;
		}
		if (CORE_PROFILE) { // didn't create new core profile also
			stripped.userId = CORE_PROFILE.userId;
			dispatch(addUserToDirectory(CURRENT_DIRECTORY.directoryId, stripped))
				.then(() => _goToDirectoryDetails(CURRENT_DIRECTORY));
		} else {
			dispatch(createCoreProfile(coreProfileModel))
				.then(r => {
					console.log(r);
					stripped.userId = r.userId;
					dispatch(addUserToDirectory(CURRENT_DIRECTORY.directoryId, stripped));
				})
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
					profile={directoryProfile}
					onSubmit={joinDirectory}
					onBack={() => setShowPreview(false)}
				/>
			) : customizeVisibility ? (
				<ProfileVisibilityPage
					directory={CURRENT_DIRECTORY}
					coreProfile={coreProfileModel}
					setParentDirectoryProfile={setDirectoryProfile}
					onSubmit={goToPreview}
					onBack={() => { CORE_PROFILE ? history.goBack() : exitVisibility() }}
				/>
			) : (
				<div className={s.root}>
					<Header title="Set up New Account" goBack={goBack} />

					{showOptional ? (
						<ProfileOptionalFields
							userModel={coreProfileModel}
							updateModel={updateCoreProfileModel}
							onSubmit={() => _setCustomizeVisibility(true)}
							goBack={() => setShowOptional(false)}
						/>
					) : (
						<ProfileMainFields
							userModel={coreProfileModel}
							updateModel={updateCoreProfileModel}
							onSubmit={() => setShowOptional(true)}
						/>
					)}
				</div>
			)}
		</>
	);
}
