import React from "react";
import SearchableIcons from "./SearchableIcons.js";

export default function SearchableSelectedList({
	selected,
	options = [],
	removeFromValue = () => {},
}) {
	const selectedList = options.filter((s) => selected.indexOf(s.value) >= 0);

	return (
		<div className="searchable__controls__list">
			{selectedList.map(({ label, value }, index) => {
				return (
					<div
						className="searchable__controls__list__item"
						key={index}
						onClick={(e) => {
							e.stopPropagation();
						}}
					>
						{label}
						<button
							className="searchable__controls__list__item__remove"
							onClick={() => {
								removeFromValue(value);
							}}
						>
							{SearchableIcons["remove"]}
						</button>
					</div>
				);
			})}
		</div>
	);
}
