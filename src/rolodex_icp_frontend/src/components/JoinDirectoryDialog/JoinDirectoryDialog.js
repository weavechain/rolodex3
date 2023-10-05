import React from "react";
import cx from "classnames";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

import s from "./JoinDirectoryDialog.module.scss";
import RoloButton from "../RoloButton/RoloButton";

export default function JoinDirectoryDialog({
	viewDashboard = () => {},
	joinDirectory = () => {},
	onCancel = () => {},
}) {
	return (
		<Modal centered isOpen={true} className={s.root} backdrop toggle={onCancel}>
			<ModalHeader toggle={onCancel}>
				<p className={s.title}>Welcome to WEV Global!</p>
			</ModalHeader>

			<ModalBody>
				<div className={s.description}>
					Congrats on taking your first steps towards taking back control of
					your data!
				</div>
			</ModalBody>

			<ModalFooter>
				<div className={s.buttons}>
					<RoloButton
						text="View WEV Global Details"
						className={cx(s.button, "btn-border")}
						onClick={joinDirectory}
						noIcon
					/>

					<RoloButton
						text="Go to Dashboard"
						className={s.button}
						onClick={viewDashboard}
						noIcon
					/>
				</div>
			</ModalFooter>
		</Modal>
	);
}
