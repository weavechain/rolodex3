import React from "react";

import GenericSelector from "../GenericSelector/GenericSelector";

export default function NameSelector(props) {
	const { value, onSelect = () => {} } = props;

	const options = ["Nickname", "Full Name"].map((name) => ({
		value: name.toLocaleLowerCase(),
		label: name,
	}));

	return (
		<GenericSelector
			{...props}
			value={value}
			options={options}
			onSelect={onSelect}
			placeholder="Choose one"
		/>
	);
}
