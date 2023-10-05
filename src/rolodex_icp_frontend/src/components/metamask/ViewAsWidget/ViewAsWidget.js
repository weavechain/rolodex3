import React from "react";
import { Button } from "reactstrap";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

import s from "./ViewAsWidget.module.scss";

import ArrowRightIcon from "../../icons/ArrowRightIcon";
import AppRoutes from "../../../helpers/AppRoutes";
import VisibleIcon from "../../icons/VisibleIcon";

export default function ViewAsWidget() {
	const history = useHistory();

	const { directories = [], CORE_DIRECTORY } = useSelector(
		(state) => state.directories
	);

	let hasJoined = false;
	directories.forEach((d) => {
		if (d.id !== CORE_DIRECTORY?.id && !!d.profile) {
			hasJoined = true;
		}
	});

	// ------------------------------------- METHODS -------------------------------------
	const viewAs = () => {
		history.push(AppRoutes.viewAs);
	};

	return hasJoined ? (
		<div className={s.root}>
			<Button className={s.button} color="primary" onClick={viewAs}>
				<VisibleIcon width={18} height={18} />
				View As <ArrowRightIcon />
			</Button>
		</div>
	) : null;
}
