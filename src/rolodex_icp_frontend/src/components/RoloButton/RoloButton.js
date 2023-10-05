import React from "react";
import cx from "classnames";
import { Button } from "reactstrap";

import s from "./RoloButton.module.scss";
import ArrowRightIcon from "../../components/icons/ArrowRightIcon";

export default function RoloButton({
	text,
	onClick = () => {},
	noIcon = false,
	disabled,
	color = "primary",
	className = "",
}) {
	return (
		<Button
			className={cx(s.root, className)}
			color={color}
			onClick={onClick}
			disabled={disabled}
		>
			{text} {noIcon ? null : <ArrowRightIcon />}
		</Button>
	);
}
