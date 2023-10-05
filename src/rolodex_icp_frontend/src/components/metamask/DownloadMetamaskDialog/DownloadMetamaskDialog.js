import React from "react";
import cx from "classnames";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

import s from "./DownloadMetamaskDialog.module.scss";
import FoxIcon from "../../icons/FoxIcon";

export default function DownloadMetamaskDialog({
	onContinue = () => {},
	close = () => {},
	theme = "",
}) {
	return (
		<Modal centered isOpen={true} className={cx(s.root, "dialog-md", theme)}>
			<ModalHeader toggle={close}>
				<p className={cx(s.title, theme === "dark" ? s.dark : "")}>
					Metamask is not installed!
				</p>
			</ModalHeader>

			<ModalBody>
				<div className={s.logoContainer}>
					<FoxIcon width="100" height="100" />
				</div>

				<p className={cx(s.description, theme === "dark" ? s.dark : "")}>
					You need to download Metamask and create or connect a wallet to
					connect to Weavechain.
				</p>
			</ModalBody>

			<ModalFooter>
				<div className={s.buttons}>
					<Button color="primary" className="btn-border" onClick={close}>
						Cancel
					</Button>
					<Button color="primary" onClick={onContinue}>
						Download Metamask
					</Button>
				</div>
			</ModalFooter>
		</Modal>
	);
}
