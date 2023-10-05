import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { addUserToDirectory } from "../../../_redux/actions/directories";

import s from "./EditDirectoryProfile.module.scss";

import Header from "../../../components/Header/Header";
import ProfileVisibilityWidget from "../../../components/ProfileVisibilityWidget/ProfileVisibilityWidget";
import SaveChangesDialog from "../../../components/SaveChangesDialog/SaveChangesDialog";

const EditDirectoryProfilePage = () => {
	const history = useHistory();
	const dispatch = useDispatch();

	const [visibleProfile, setVisibleProfile] = useState(null);
	const [showDialog, setShowDialog] = useState(null);
	const [hasChanges, setHasChanges] = useState(null);

	const { CURRENT_DIRECTORY } = useSelector((state) => state.directories);
	const profile = CURRENT_DIRECTORY?.profile;

	useEffect(() => {
		if (profile) {
			setVisibleProfile(profile);
		}
	}, [profile]);

	// ------------------------------------- METHODS -------------------------------------
	const updateProfile = (data) => {
		setVisibleProfile(data);
		setHasChanges(true);
	};

	const saveChanges = () => {
		setShowDialog(false);
		setHasChanges(false);

		dispatch(addUserToDirectory(CURRENT_DIRECTORY, visibleProfile)).then(() => {
			history.goBack();
		});
	};

	const goBack = () => {
		if (hasChanges) {
			setShowDialog(true);
		} else {
			history.goBack();
		}
	};

	return (
		<div className={s.root}>
			<Header title="Edit Directory Profile" goBack={goBack}>
				{hasChanges ? (
					<div className={s.saveText} onClick={saveChanges}>
						Save
					</div>
				) : null}
			</Header>

			{showDialog ? (
				<SaveChangesDialog
					saveChanges={saveChanges}
					close={() => setShowDialog(false)}
				/>
			) : null}

			<div className={s.content}>
				{visibleProfile ? (
					<ProfileVisibilityWidget
						directory={CURRENT_DIRECTORY}
						profile={visibleProfile}
						updateProfile={updateProfile}
					/>
				) : null}
			</div>
		</div>
	);
};

export default React.memo(EditDirectoryProfilePage);
