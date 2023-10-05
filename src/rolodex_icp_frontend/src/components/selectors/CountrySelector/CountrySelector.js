import React from "react";

import Countries from "./Countries";
import GenericSelector from "../GenericSelector/GenericSelector";

export default function CountrySelector(props) {
	const { value, onSelect = () => {} } = props;

	const options = Countries.map(({ name }) => ({
		value: name,
		label: name,
	}));

	return (
		<GenericSelector
			value={value}
			options={options}
			onSelect={onSelect}
			title={props.noTitle ? null : "Country"}
			placeholder="Country"
			hasOther
		/>
	);
}
