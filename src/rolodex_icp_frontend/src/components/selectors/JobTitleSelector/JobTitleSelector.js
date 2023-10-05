import React from "react";

import Jobs from "./Jobs";
import GenericSelector from "../GenericSelector/GenericSelector";

export default function JobTitleSelector(props) {
	const { value, onSelect = () => {} } = props;

	const options = Jobs.map((name) => ({
		value: name,
		label: name,
	}));

	return (
		<GenericSelector
			value={value}
			options={options}
			onSelect={onSelect}
			title="Job Title"
			placeholder="ex. Engineer"
			hasOther
		/>
	);
}
