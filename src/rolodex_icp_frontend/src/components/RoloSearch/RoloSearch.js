import React, { useEffect, useState } from "react";
import cx from "classnames";
import { FormGroup, Input } from "reactstrap";
import { escapeRegExp } from "lodash";

import s from "./RoloSearch.module.scss";

import { useDebounce } from "../../helpers/useDebounce";
import SearchIcon from "../icons/SearchIcon";
import ClearIcon from "../icons/ClearIcon";

const SEARCH_DELAY = 500;

export default function RoloSearch(props) {
	const { data, setData = () => {}, className = "", fullWidth = true } = props;

	const [queryText, setQueryText] = useState("");
	const debouncedSearchTerm = useDebounce(queryText, SEARCH_DELAY);

	useEffect(() => {
		__filterByText(queryText);
		// eslint-disable-next-line
	}, [debouncedSearchTerm]);

	// ------------------------------------- METHODS -------------------------------------
	const __filterByText = (text) => {
		let filteredData = data || [];

		// Multi terms search
		if (text) {
			let pattern = "";
			try {
				pattern = new RegExp(escapeRegExp(text).split(" ").join("|"), "gi");
			} catch (error) {}

			filteredData = filteredData.filter(
				(a) =>
					(a.name?.value
						? a.name?.value?.match(pattern)
						: a.name?.match(pattern)) ||
					a.nickname?.displayText?.match(pattern) ||
					a.date_created?.match(pattern) ||
					(a.directories || []).join(",").match(pattern) ||
					a.description?.match(pattern)
			);
		}

		setData([...filteredData]);
	};

	const clearSearch = () => {
		__filterByText("");
		setQueryText("");
	};

	return (
		<FormGroup className={cx(s.root, className, { [s.short]: !fullWidth })}>
			<div className={s.search}>
				<SearchIcon />
			</div>

			<Input
				className={cx(s.searchInput, {
					[s.placeholder]: !queryText,
				})}
				placeholder={"Search"}
				value={queryText || ""}
				onChange={(e) => setQueryText(e.target.value)}
			/>

			{queryText ? (
				<div className={cx(s.iconContainer, s.pointer)} onClick={clearSearch}>
					<ClearIcon />
				</div>
			) : null}
		</FormGroup>
	);
}
