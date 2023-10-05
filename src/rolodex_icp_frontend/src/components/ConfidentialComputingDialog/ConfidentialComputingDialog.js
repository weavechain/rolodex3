import React from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

import s from "./ConfidentialComputingDialog.module.scss";
import InfoIcon from "../icons/InfoIcon";
import RoloButton from "../RoloButton/RoloButton";

export default function ConfidentialComputingDialog() {
	const [showDialog, setShowDialog] = React.useState(false);

	const toggleDialog = () => {
		setShowDialog(!showDialog);
	};

	return (
		<div className={s.root}>
			<div className={s.icon} onClick={() => setShowDialog(true)}>
				<InfoIcon />
			</div>

			<Modal centered isOpen={showDialog} className={s.root}>
				<ModalHeader toggle={toggleDialog}>
					<p className={s.title}>What's Confidential Computing?</p>
				</ModalHeader>

				<ModalBody>
					<div className={s.description}>
						Making your data available for confidential computing means your
						hidden information can be used in calculations{" "}
						<span>without anyone ever accessing the data itself. </span> This
						allows RoloDEX to do fun things like calculate the average birthday
						across a directory without ever knowing anyone's actual birthday.
						Pretty cool, huh?
					</div>
				</ModalBody>

				<ModalFooter>
					<div className={s.buttons}>
						<RoloButton
							text="Got It"
							className={s.button}
							onClick={toggleDialog}
						/>
					</div>
				</ModalFooter>
			</Modal>
		</div>
	);
}
