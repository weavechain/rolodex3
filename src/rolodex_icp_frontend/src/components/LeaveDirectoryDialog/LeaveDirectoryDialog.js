import React from "react";
import cx from "classnames";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { removeUserFromDirectory } from "../../_redux/actions/directories";

import s from "./LeaveDirectoryDialog.module.scss";

import RoloButton from "../RoloButton/RoloButton";
import AppRoutes from "../../helpers/AppRoutes";

export default function LeaveDirectoryDialog({ directory, close = () => { } }) {
	const history = useHistory();
	const dispatch = useDispatch();
	const profile = useSelector(state => state.user);

	// ------------------------------------- METHODS -------------------------------------
	const editProfile = () => {
		history.push(`${AppRoutes.directories}/${directory.id}/profile/edit`);
	};

	const leaveDirectory = () => {
		removeUserFromDirectory(directory, profile)
			.then(() => history.push(`${AppRoutes.myDirectories}`));
	};

	return (
		<Modal centered isOpen={true} className={s.root} backdrop toggle={close}>
			<ModalHeader toggle={close}>
				<p className={s.title}>Are you sure?</p>
			</ModalHeader>

			<ModalBody>
				<div className={s.description}>
					We'd hate to see you go! You can always edit your profile instead to
					hide information you don't want to share with this directory.
				</div>
			</ModalBody>

			<ModalFooter>
				<div className={s.buttons}>
					<RoloButton
						text="Edit Directory Profile"
						className={cx(s.button, "btn-border")}
						onClick={editProfile}
						noIcon
					/>

					<RoloButton
						text="Leave Directory"
						className={cx(s.button, "btn-danger")}
						onClick={leaveDirectory}
						noIcon
					/>
				</div>
			</ModalFooter>
		</Modal>
	);
}
