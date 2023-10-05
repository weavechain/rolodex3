import React from "react";

import GenericSelector from "../GenericSelector/GenericSelector";

export default function SushiSelector(props) {
	const { value, onSelect = () => {} } = props;

	const options = [
		"Tuna (& fatty Tuna)",
		"Salmon",
		"Yellowtail",
		"Eel",
		"Ikura",
		"Uni",
		"I don't like sushi",
		"I've never had sushi",
	].map((name) => ({
		value: name,
		label: name,
	}));

	return (
		<GenericSelector
			value={value}
			options={options}
			onSelect={onSelect}
			title={props.noTitle ? "" : "Favorite Sushi?"}
			placeholder="Choose one"
			hasOther
		/>
	);
}
