import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import s from "./DirectoryProfilePage.module.scss";

import Header from "../../../components/Header/Header";
import AppRoutes from "../../../helpers/AppRoutes";
import TabsWidget from "../../../components/TabsWidget/TabsWidget";
import ProfileViewWidget from "../../../components/ProfileViewWidget/ProfileViewWidget";
import RoloButton from "../../../components/RoloButton/RoloButton";
import LeaveDirectoryDialog from "../../../components/LeaveDirectoryDialog/LeaveDirectoryDialog";
import { setUserProfileForDirectory } from "../../../_redux/actions/directories";

export default function DirectoryProfilePage() {
	const history = useHistory();
	const dispatch = useDispatch();
	const { id } = useParams() || {};

	const [showDialog, setShowDialog] = useState(false);

	let directoryProfile = useSelector(state => state.user.directoryProfile);

	const { directories = [] } = useSelector((state) => state.directories);
	const directory = directories.find((d) => d.directoryId === id);

	let [hasJoined, setHasJoined] = useState(false);
	useEffect(() => {
		dispatch(setUserProfileForDirectory(directoryProfile.userId, id))
			.then(r => setHasJoined(r));
	}, []);

	if (!directory) {
		history.push(AppRoutes.home);
		return null;
	}

	return (
		<div className={s.root}>
			{showDialog ? (
				<LeaveDirectoryDialog
					directory={directory}
					close={() => setShowDialog(false)}
				/>
			) : null}

			<Header title="My Directory Profile" showBack />

			{hasJoined ? (
				<TabsWidget
					tabs={[
						{ name: "About", url: `${AppRoutes.directories}/${directory.directoryId}` },
						{
							name: "Members",
							url: `${AppRoutes.directories}/${directory.directoryId}/members`,
						},
						{
							name: "My Dir. Profile",
							isActive: true,
						},
					]}
				/>
			) : null}

			<div className={s.content}>
				<ProfileViewWidget profile={directoryProfile} directory={directory} isNested={false}/>

				<div className={s.buttons}>
					<RoloButton
						color="info"
						className="btn-danger btn-border"
						text="Leave Directory"
						noIcon
						onClick={() => setShowDialog(true)}
					/>
				</div>
			</div>
		</div>
	);
}
