import React from "react";
import Checkbox from "react-custom-checkbox";

import s from "./CheckboxWidget.module.scss";

import IconCheckWhite from "../icons/IconCheckWhite";

const CheckboxWidget = ({
	checked = false,
	disabled = false,
	label = "",
	onChange = () => {},
	labelStyle = null,
	size = 13,
	borderWidth = 2,
}) => {
	const labelStyles = labelStyle || {
		cursor: "pointer",
		marginLeft: 4,
		userSelect: "none",
		fontFamily: "Poppins",
		fontWeight: "400",
		color: "#FFF",
		fontSize: "11px",
	};

	const bgStyle = disabled
		? { backgroundColor: "#78909C" }
		: checked
		? { backgroundColor: "#1cd0af" }
		: {};

	const borderColor = checked ? (disabled ? "#78909C" : "#1cd0af") : "#D9DBE1";

	return (
		<Checkbox
			size={size}
			onChange={onChange}
			checked={checked}
			disabled={disabled}
			icon={<IconCheckWhite />}
			className={s.checkbox}
			style={bgStyle}
			borderColor={borderColor}
			borderWidth={borderWidth}
			label={label}
			labelStyle={disabled ? { ...labelStyles, color: "#78909c" } : labelStyles}
		/>
	);
};
export default CheckboxWidget;
