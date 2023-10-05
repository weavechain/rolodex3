import React from "react";
import cx from "classnames";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { useHistory } from "react-router-dom";

import s from "./SaveChangesDialog.module.scss";

import RoloButton from "../RoloButton/RoloButton";

export default function SaveChangesDialog({
	saveChanges = () => {},
	close = () => {},
}) {
	const history = useHistory();

	// ------------------------------------- METHODS -------------------------------------
	const cancelChanges = () => {
		history.goBack();
	};

	return (
		<Modal centered isOpen={true} className={s.root} backdrop toggle={close}>
			<ModalHeader toggle={close}>
				<p className={s.title}>Save Changes?</p>
			</ModalHeader>

			<ModalBody>
				<div className={s.description}>
					Do you want to save your changes before leaving this page?
				</div>
			</ModalBody>

			<ModalFooter>
				<div className={s.buttons}>
					<RoloButton
						text="Leave Without Saving"
						className={cx(s.button, "btn-border")}
						onClick={cancelChanges}
						noIcon
					/>

					<RoloButton
						text="Save Changes"
						className={cx(s.button)}
						onClick={saveChanges}
						noIcon
					/>
				</div>
			</ModalFooter>
		</Modal>
	);
}
