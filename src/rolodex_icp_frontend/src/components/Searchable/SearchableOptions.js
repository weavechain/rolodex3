import React from "react";
import SearchableIcons from "./SearchableIcons";
import CheckboxWidget from "../CheckboxWidget/CheckboxWidget";

export default function SearchableOptions({
	value,
	options,
	multiple,
	opened,
	arrow,
	listMaxHeight,
	notFoundText,
	onSelect = () => {},
	showRadios = false,
}) {
	return (
		<>
			{options.length && opened ? (
				<div
					className="searchable__list"
					//ref={(node) => (this.list = node)}
					style={{
						maxHeight: listMaxHeight,
					}}
				>
					{options.map((option, index) => {
						let isArrow = arrow.position >= 0 && index === arrow.position,
							isActive = !multiple
								? value === option.value
								: value.indexOf(option.value) >= 0;
						return (
							<div
								key={index}
								className={"searchable__list__row"}
								onClick={(e) => {
									e.stopPropagation();
									onSelect(option, isActive);
								}}
							>
								{multiple ? (
									<div className={"custom-checkbox"}>
										<CheckboxWidget checked={isActive} onChange={() => {}} />
									</div>
								) : showRadios ? (
									<div className={"custom-control custom-radio"}>
										<input
											type="radio"
											id="radio-selector"
											name="options-radio-group"
											className="custom-control-input"
											checked={isActive}
											onChange={() => {}}
										/>
										<label
											className={"custom-control-label"}
											htmlFor={"radio-selector"}
										/>
									</div>
								) : null}

								<div
									key={index}
									className={[
										"searchable__list__item",
										"searchable__list__item--" + index,
										isActive ? "searchable__list__item--active" : "",
										option.disabled ? "disabled" : "",
										isArrow ? "searchable__list__item--arrow-position" : "",
									].join(" ")}
								>
									{isArrow && (
										<i className="searchable__list__item__arrow">
											{SearchableIcons["arrowDown"]}
										</i>
									)}
									{option.label}
								</div>
							</div>
						);
					})}
				</div>
			) : null}

			{!options.length && opened ? (
				<div className="searchable__list searchable__list--empty">
					{notFoundText}
				</div>
			) : null}
		</>
	);
}
