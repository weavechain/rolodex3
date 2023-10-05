import React, { useEffect, useState } from "react";
import cx from "classnames";
import s from "./ToggleWidget.module.scss";

export default function ToggleWidget({
	isVisible = false,
	onToggle = () => {},
	disabled = [],
	className = "",
}) {
	const options = ["hide", "show"];
	const [selectedIndex, setSelectedIndex] = useState(0);

	useEffect(() => {
		setSelectedIndex(isVisible ? 1 : 0);
	}, [isVisible]);

	// ------------------------------------- METHODS -------------------------------------
	const handlePress = (option, index) => {
		if (disabled.includes(option) || selectedIndex === index) return;
		setSelectedIndex(index);
		onToggle(option === "show");
	};

	return (
		<div className={cx(s.root, className)}>
			{options.map((option, index) => (
				<div
					key={index}
					className={cx(s.option, { [s.selected]: selectedIndex === index })}
					onClick={() => handlePress(option, index)}
				>
					<span className={s.text}>{option}</span>
				</div>
			))}
		</div>
	);
}
