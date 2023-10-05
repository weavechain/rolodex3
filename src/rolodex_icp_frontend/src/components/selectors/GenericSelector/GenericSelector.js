import React from "react";
import cx from "classnames";

import s from "./GenericSelector.module.scss";

import Searchable from "../../Searchable/Searchable";
import InputWidget from "../../InputWidget/InputWidget";

export default function GenericSelector(props) {
	const {
		value,
		options,
		title,
		placeholder = "Country",
		genericTitle = "",
		className,
		hasOther = false,
		multiple = false,
		onSelect = () => {},
	} = props;

	const allOptions = hasOther
		? [...options, { value: "other", label: "Other" }]
		: options;

	// User selected a different options than OTHER
	let selected = value;
	if (hasOther) {
		const userOption = options.find((o) => o.value === value);
		selected = userOption ? userOption.value : !!value ? "other" : "";
	}

	return (
		<div className={s.root}>
			{title ? <div className={s.title}>{title}</div> : null}
			<Searchable
				className={cx(s.searchable, className)}
				placeholder={placeholder}
				notFoundText="No result found"
				value={selected || ""}
				options={allOptions}
				onSelect={onSelect}
				listMaxHeight={200}
				multiple={multiple}
				hasDarkTheme
			/>

			{hasOther && selected === "other" ? (
				<div className={s.other}>
					<InputWidget
						title={genericTitle || "Something else"}
						titleClass={s.title}
						value={value !== "other" ? value : ""}
						placeholder=""
						onChange={onSelect}
					/>
				</div>
			) : null}
		</div>
	);
}
