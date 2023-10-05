import React from "react";

import GenericSelector from "../GenericSelector/GenericSelector";

export default function LookingForSelector(props) {
	const { value, onSelect = () => {} } = props;

	const options = ["Collaborators", "Networking", "Investors"].map((name) => ({
		value: name,
		label: name,
	}));

	return (
		<GenericSelector
			value={value}
			options={options}
			onSelect={onSelect}
			title={props.noTitle ? null : "Looking for..."}
			genericTitle="What are you looking for?"
			placeholder="Select one or more..."
			multiple
		/>
	);
}
