import React from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import cx from "classnames";

import s from "./ConfirmDialog.module.scss";

export default function ConfirmDialog({
	isOpen,
	title,
	description,
	children,
	buttons = [],
	toggle,
}) {
	const cancel = buttons.find((b) => b.isCancel);
	const toggleAction = cancel?.action || toggle;

	return (
		<Modal centered isOpen={isOpen} className={s.root}>
			<ModalHeader toggle={toggleAction}>
				<p className={s.title}>{title}</p>
			</ModalHeader>

			<ModalBody>
				<p className={s.description}>{description}</p>
				{children && <div className={s.content}>{children}</div>}
			</ModalBody>

			<ModalFooter>
				<div className={s.buttons}>
					{buttons.map(({ text, color, action, isEmpty }, index) => (
						<Button
							key={index}
							color={color || "primary"}
							className={cx(isEmpty ? "btn-border" : "")}
							onClick={action}
						>
							{text}
						</Button>
					))}
				</div>
			</ModalFooter>
		</Modal>
	);
}
