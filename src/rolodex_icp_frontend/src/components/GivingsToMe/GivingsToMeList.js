import React from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

import { getListNameForAccount, hasItems } from "../../helpers/Utils";
import { setCurrentGiving } from "../../_redux/actions/contacts";

import s from "./GivingsToMeList.module.scss";

import ArrowRightIcon from "../icons/ArrowRightIcon";
import EmptyImage from "../../assets/images/general/empty-directories.svg";
import AppRoutes from "../../helpers/AppRoutes";

export default function GivingsToMeList({
	givings = [],
	showNewEntries = false,
}) {
	const dispatch = useDispatch();
	const history = useHistory();

	// ------------------------------------- METHODS -------------------------------------
	const viewGivingDetails = (giving) => {
		dispatch(
			setCurrentGiving({
				...giving,
				seen: false,
			})
		).then(() => {
			history.push(`${AppRoutes.contacts}/${giving.giver.userId}`);
		});
	};

	return (
		<div className={s.root}>
			{hasItems(givings) ? (
				<>
					{givings.map((g, index) => (
						<div
							key={index}
							className={s.directory}
							onClick={() => viewGivingDetails(g)}
						>
							<div className={s.info}>
								<div className={s.name}>{getListNameForAccount(g.giver)}</div>
								<div className={s.description}>
									<span className={showNewEntries && !g.was_seen ? s.new : ""}>
										{new Date(Number(g.giver.ts)).toISOString().split('T')[0]}
									</span>
									<span className={s.separator}>|</span>
									<span className={s.directories}>
										{(g.directories || []).join(", ")}
									</span>
								</div>
							</div>
							<ArrowRightIcon />
						</div>
					))}
				</>
			) : (
				<div className={s.empty}>
					<div className={s.card}>
						<div className={s.title}>Nothing to see here!</div>
						<div className={s.description}></div>
					</div>

					<img src={EmptyImage} alt="..." />
				</div>
			)}
		</div>
	);
}
