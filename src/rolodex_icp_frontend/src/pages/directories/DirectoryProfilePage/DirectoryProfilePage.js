import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router";
import { useSelector } from "react-redux";

import s from "./DirectoryProfilePage.module.scss";

import Header from "../../../components/Header/Header";
import AppRoutes from "../../../helpers/AppRoutes";
import TabsWidget from "../../../components/TabsWidget/TabsWidget";
import ProfileViewWidget from "../../../components/ProfileViewWidget/ProfileViewWidget";
import RoloButton from "../../../components/RoloButton/RoloButton";
import LeaveDirectoryDialog from "../../../components/LeaveDirectoryDialog/LeaveDirectoryDialog";
import PencilIcon from "../../../components/icons/PencilIcon";

export default function DirectoryProfilePage() {
	const history = useHistory();
	const { id } = useParams() || {};

	const [showDialog, setShowDialog] = useState(false);

	const { directories = [] } = useSelector((state) => state.directories);
	const directory = directories.find((d) => d.id === id);
	const hasJoined = !!directory?.profile;

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

			<Header title="My Directory Profile" showBack>
				<div className={s.headerIcon}>
					<a href={`#${AppRoutes.directories}/${id}/profile/edit`}>
						<PencilIcon />
					</a>
				</div>
			</Header>

			{hasJoined ? (
				<TabsWidget
					tabs={[
						{ name: "About", url: `${AppRoutes.directories}/${directory.id}` },
						{
							name: "Members",
							url: `${AppRoutes.directories}/${directory.id}/members`,
						},
						{
							name: "My Dir. Profile",
							isActive: true,
						},
					]}
				/>
			) : null}

			<div className={s.content}>
				<ProfileViewWidget profile={directory?.profile} directory={directory} />

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
