import React from "react";
import cx from "classnames";
import { useHistory } from "react-router";

import s from "./Header.module.scss";

import ArrowLeftIcon from "../../components/icons/ArrowLeftIcon";

export default function Header({
	className = "",
	title,
	children,
	showBack = false,
	goBack,
}) {
	const history = useHistory();

	// ------------------------------------- METHODS -------------------------------------
	const navigateBack = () => {
		if (goBack) {
			goBack();
		} else {
			history.goBack();
		}
	};

	return (
		<div className={cx(s.root, className)}>
			{showBack || goBack ? (
				<div className={s.backButton} onClick={navigateBack}>
					<ArrowLeftIcon />
					<span>Back</span>
				</div>
			) : null}

			{title ? <div className={s.title}>{title}</div> : null}
			{children && <>{children}</>}
		</div>
	);
}
