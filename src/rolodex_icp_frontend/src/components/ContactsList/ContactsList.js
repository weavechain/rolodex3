import React from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

import { getListNameForAccount, hasItems } from "../../helpers/Utils";
import { setCurrentContact } from "../../_redux/actions/contacts";

import s from "./ContactsList.module.scss";

import ArrowRightIcon from "../icons/ArrowRightIcon";
import EmptyImage from "../../assets/images/general/empty-directories.svg";
import AppRoutes from "../../helpers/AppRoutes";

export default function ContactsList({
	contacts = [],
	showNewEntries = false,
	onContactSelected,
}) {
	const dispatch = useDispatch();
	const history = useHistory();

	// ------------------------------------- METHODS -------------------------------------
	const viewContactDetails = (contact) => {
		dispatch(
			setCurrentContact({
				...contact,
				seen: false,
			})
		).then(() => {
			if (onContactSelected) {
				onContactSelected(contact);
			} else {
				history.push(`${AppRoutes.contacts}/${contact.id}`);
			}
		});
	};

	return (
		<div className={s.root}>
			{hasItems(contacts) ? (
				<>
					{contacts.map((c, index) => (
						<div
							key={index}
							className={s.directory}
							onClick={() => viewContactDetails(c)}
						>
							<div className={s.info}>
								<div className={s.name}>{getListNameForAccount(c)}</div>
								<div className={s.description}>
									<span className={showNewEntries && !c.was_seen ? s.new : ""}>
										{new Date(Number(c.joinTs)).toISOString().split('T')[0]}
									</span>
									<span className={s.separator}>|</span>
									<span className={s.directories}>
										{(c.directories || []).join(", ")}
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
