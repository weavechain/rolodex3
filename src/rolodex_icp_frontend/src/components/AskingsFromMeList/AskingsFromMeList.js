import React from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

import { getListNameForAccount, hasItems } from "../../helpers/Utils";
import { setCurrentAsking, setCurrentContact } from "../../_redux/actions/contacts";

import s from "./AskingsFromMeList.module.scss";

import ArrowRightIcon from "../icons/ArrowRightIcon";
import EmptyImage from "../../assets/images/general/empty-directories.svg";
import AppRoutes from "../../helpers/AppRoutes";

export default function AskingsFromMeList({
	askings = [],
	showNewEntries = false,
	onAskingSelected,
}) {
	const dispatch = useDispatch();
	const history = useHistory();

	// ------------------------------------- METHODS -------------------------------------
	const viewAskingDetails = (asking) => {
		dispatch(
			setCurrentAsking({
				...asking,
				seen: false,
			}))
			.then(() => {
				return dispatch(setCurrentContact({
					...asking.asker
				}))
			})
			.then(() => {
				if (onAskingSelected) {
					onAskingSelected(asking);
				} else {
					history.push(`${AppRoutes.contacts}/${asking.asker.userId}`);
				}
			});
	};

	return (
		<div className={s.root}>
			{hasItems(askings) ? (
				<>
					{askings.map((a, index) => (
						<div
							key={index}
							className={s.directory}
							onClick={() => viewAskingDetails(a)}
						>
							<div className={s.info}>
								<div className={s.name}>{getListNameForAccount(a.asker)}</div>
								<div className={s.description}>
									<span className={showNewEntries && !a.was_seen ? s.new : ""}>
										{new Date(Number(a.asker.ts)).toISOString().split('T')[0]}
									</span>
									<span className={s.separator}>|</span>
									<span className={s.directories}>
										{(a.directories || []).join(", ")}
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
