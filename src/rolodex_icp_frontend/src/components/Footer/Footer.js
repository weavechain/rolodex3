import React from "react";
import cx from "classnames";
import { useMetaMask } from "metamask-react";
import { useHistory } from "react-router";
import { useSelector } from "react-redux";

import s from "./Footer.module.scss";

import AppRoutes from "../../helpers/AppRoutes";
import BrowseIcon from "./icons/BrowseIcon";
import DirectoriesIcon from "./icons/DirectoriesIcon";
import HomeIcon from "./icons/HomeIcon";
import ProfileIcon from "./icons/ProfileIcon";
import ContactsIcon from "./icons/ContactsIcon";
import AppHelper from "../../helpers/AppHelper";

export default function Footer({ page, showFooter, className = "", search }) {
	const history = useHistory();
	const { account } = useMetaMask();

	const contacts = useSelector((state) => state.contacts);
	const { CORE_PROFILE } = useSelector((state) => state.directories);
	const user = useSelector(state => state.user.coreProfile);
	const notificationsCount = AppHelper.getNotificationsCount(contacts);

	const isLoggedIn = !!account || !!CORE_PROFILE || showFooter || user;

	const pages = [
		{ name: "Home", path: AppRoutes.home, icon: HomeIcon },
		{ name: "Browse", path: AppRoutes.directories, icon: BrowseIcon },
		{
			name: "My Directories",
			path: AppRoutes.myDirectories,
			icon: DirectoriesIcon,
		},
		{ name: "Contacts", path: AppRoutes.contacts, icon: ContactsIcon },
		{ name: "Core Profile", path: AppRoutes.coreProfile, icon: ProfileIcon },
	];

	// ------------------------------------- METHODS -------------------------------------
	const goTo = (page) => history.push(page);

	return !isLoggedIn ? null : (
		<div className={cx(s.root, className)}>
			{search ? <div className={s.search}>{search}</div> : null}

			<div className={s.content}>
				{pages.map(({ name, path, icon: ICON }, index) => (
					<div
						key={index}
						onClick={() => goTo(path)}
						className={cx(s.cell, {
							[s.active]: path === page,
						})}
					>
						<div
							className={
								["Home", "Contacts"].includes(name) ? s.fillIcon : s.strokeIcon
							}
						>
							<ICON />

							{notificationsCount > 0 && name === "Contacts" ? (
								<div className={s.notifications}>
									{notificationsCount >= 100 ? ":)" : notificationsCount}
								</div>
							) : null}
						</div>
						<span>{name}</span>
					</div>
				))}
			</div>
		</div>
	);
}
