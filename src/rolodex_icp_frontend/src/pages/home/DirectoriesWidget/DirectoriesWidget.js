import React from "react";
import cx from "classnames";

import { hasItems } from "../../../helpers/Utils";

import s from "./DirectoriesWidget.module.scss";
import ArrowRightEmptyIcon from "../../../components/icons/ArrowRightEmptyIcon";

export default function DirectoriesWidget({
	directories = [],
	title = "Browse Directories",
	titleLink,
}) {
	// 2023.09: show max 8
	const itemsToDisplay = directories.slice(0, 8);

	return (
		<div className={s.root}>
			<div className={s.directoryHeader}>
				<div className={s.sectionTitle}>{title}</div>
				{titleLink ? (
					<div className={s.link}>
						<a className={s.text} href={`#${titleLink}`}>
							See All
						</a>
						<ArrowRightEmptyIcon />
					</div>
				) : null}
			</div>

			{hasItems(directories) ? (
				<div className={s.list}>
					{itemsToDisplay.map(({ id, name, icon, established_date }, index) => (
						<a key={index} className={s.directory} href={`#/directories/${id}`}>
							<div
								className={cx(s.image, {
									[s.whiteBg]: name === "EthGlobal Paris 2023",
								})}
							>
								<img src={icon} alt="..." />
							</div>
							<p className={s.name}>{name}</p>
							<p className={s.date}>{established_date}</p>
						</a>
					))}
				</div>
			) : null}
		</div>
	);
}
