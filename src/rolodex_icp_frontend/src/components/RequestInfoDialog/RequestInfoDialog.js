import React from "react";
import cx from "classnames";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { useHistory } from "react-router-dom";

import s from "./RequestInfoDialog.module.scss";

import RoloButton from "../RoloButton/RoloButton";
import AppRoutes from "../../helpers/AppRoutes";

export default function RequestInfoDialog({
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
		history.push(`${AppRoutes.exchangeInfo}/${contactId}/share`);
	};

	return (
		<Modal centered isOpen={true} className={s.root} backdrop toggle={close}>
			<ModalHeader toggle={close}>
				<p className={s.title}>Information Requested!</p>
			</ModalHeader>

			<ModalBody>
				<div className={s.description}>
					Do you want to also share your information?
				</div>
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
						text="Share Information"
						className={s.button}
						onClick={requestInfo}
						noIcon
					/>
				</div>
			</ModalFooter>
		</Modal>
	);
}
