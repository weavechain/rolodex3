import React, { useState } from "react";

import cx from "classnames";

import CopyDoneIcon from "../icons/CopyDoneIcon";
import CopyIcon from "../icons/CopyIcon";

import s from "./CopyTextWidget.module.scss";

const CopyTextWidget = ({
	text,
	title = "",
	rootClassName = "",
	className = "",
	titleStyle = {},
}) => {
	const [isCopied, setIsCopied] = useState(false);

	const IconTag = isCopied ? CopyDoneIcon : CopyIcon;

	// ------------------------------------- METHODS -------------------------------------
	const copyToClipboard = async () => {
		setIsCopied(true);

		if ("clipboard" in navigator) {
			return navigator.clipboard.writeText(text);
		} else {
			return document.execCommand("copy", true, text);
		}
	};

	const closeTooltip = () => {
		setIsCopied(false);
	};

	return (
		<div className={cx(s.root, rootClassName)}>
			{title && <div className={cx(s.title, titleStyle)}>{title}</div>}

			<div
				className={s.copyWidget}
				onClick={copyToClipboard}
				onMouseLeave={closeTooltip}
			>
				<div className={cx(s.text, className, isCopied ? s.valid : "")}>
					<p>{text}</p>
				</div>

				<div className={s.copyIcon}>
					<IconTag
						color={"#a3a4a6"}
						width={16}
						height={16}
					/>
				</div>
			</div>
		</div>
	);
};
export default CopyTextWidget;
