import React from "react";

import GenericSelector from "../GenericSelector/GenericSelector";

export default function AddressSelector(props) {
	const { value = "hide", onSelect = () => {} } = props;

	const options = ["City, State, & Country", "Country", "Hide"].map((name) => ({
		value: name.toLocaleLowerCase(),
		label: name,
	}));

	const selectedValue = value ? value : "city, state, & country";

	return (
		<GenericSelector
			{...props}
			value={selectedValue}
			options={options}
			onSelect={onSelect}
			placeholder="Choose one"
		/>
	);
}
