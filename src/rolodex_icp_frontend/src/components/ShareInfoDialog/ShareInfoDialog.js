import React from "react";
import cx from "classnames";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { useHistory } from "react-router-dom";

import s from "./ShareInfoDialog.module.scss";

import RoloButton from "../RoloButton/RoloButton";
import AppRoutes from "../../helpers/AppRoutes";

export default function ShareInfoDialog({
	contactId,
	directory,
	close = () => {},
}) {
	const history = useHistory();

	// ------------------------------------- METHODS -------------------------------------
	const viewDirectoryProfile = () => {
		history.push(
			`${AppRoutes.directories}/${directory.id}/members/${contactId}`
		);
	};

	const requestInfo = () => {
		history.push(`${AppRoutes.exchangeInfo}/${contactId}`);
	};

	return (
		<Modal centered isOpen={true} className={s.root} backdrop toggle={close}>
			<ModalHeader toggle={close}>
				<p className={s.title}>Information Shared!</p>
			</ModalHeader>

			<ModalBody>
				<div className={s.description}>Do you want to request information?</div>
			</ModalBody>

			<ModalFooter>
				<div className={s.buttons}>
					<RoloButton
						text="Back to Directory Profile"
						className={cx(s.button, "btn-border")}
						onClick={viewDirectoryProfile}
						noIcon
					/>

					<RoloButton
						text="Request Information"
						className={s.button}
						onClick={requestInfo}
						noIcon
					/>
				</div>
			</ModalFooter>
		</Modal>
	);
}
