import React, { useState } from "react";
import _ from "lodash";
import cx from "classnames";

import s from "./SortingWidget.module.scss";

export default function SortingWidget({
	members = [],
	showContacts = false,
	onUpdate = () => {},
}) {
	// SORT BY
	const sortOptions = [
		{ name: "A to Z", sort_by: "name", direction: "asc" },
		{ name: "Z to A", sort_by: "name", direction: "desc" },
		{
			name: "Newest",
			sort_by: "date_created",
			direction: "desc",
		},
		{
			name: "Oldest",
			sort_by: "date_created",
			direction: "asc",
		},
	];

	if (showContacts) {
		sortOptions.push({
			name: "Contacts",
			sort_by: "contacts",
			direction: "asc",
		});
	}

	const [sortBy, setSortBy] = useState("name");
	const [sortDir, setSortDir] = useState("asc");

	// ------------------------------------- METHODS -------------------------------------
	const onSortClicked = (sort_by, dir) => {
		let sortedList = [];
		if (sort_by === "contacts") {
			sortedList = members.filter((m) => m.isContact);
			// For directory members ({value: "smith", displayText: "Smith"})
		} else if (sort_by === "name") {
			sortedList = _.orderBy(members, (m) => [m.name?.value, m.name?.value], [
				dir,
			]);
		} else {
			sortedList = _.orderBy(members, sort_by, dir);
		}

		onUpdate(sortedList);
		setSortBy(sort_by);
		setSortDir(dir);
	};
	return (
		<div className={s.root}>
			<div className={s.label}>Sort by</div>
			<div className={s.options}>
				{sortOptions.map(({ name, sort_by, direction }, index) => (
					<div
						key={index}
						onClick={() => onSortClicked(sort_by, direction)}
						className={cx(s.option, {
							[s.selected]: sort_by === sortBy && sortDir === direction,
						})}
					>
						{name}
					</div>
				))}
			</div>
		</div>
	);
}
