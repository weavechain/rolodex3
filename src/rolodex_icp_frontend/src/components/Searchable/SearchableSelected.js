import React from "react";
import { hasItems } from "../../helpers/Utils";

export default function SearchableSelected({
	selected = [],
	options,
	//itemsType = "",
}) {
	let labels = [];
	options.forEach((o) => {
		const index = selected.findIndex((element) => {
			return element.toLowerCase() === o.value?.toLowerCase();
		});

		if (index > -1) {
			labels.push(o.label);
		}
	});

	//const selectedCount = labels.length;
	const sorted = labels.sort((a, b) => (a.length > b.length ? 1 : -1));

	/* const text = hasItems(sorted)
		? sorted[0].toUpperCase() +
		  (selectedCount > 1 ? `, +${pluralize(itemsType, selectedCount - 1)}` : "")
		: ""; */

	const text = hasItems(sorted) ? sorted.join(", ") : "";

	return (
		<div className="searchable__controls__list">
			{text && (
				<div className="searchable__controls__list__selected">{text}</div>
			)}
		</div>
	);
}
