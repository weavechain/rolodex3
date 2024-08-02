import React, { useState, useEffect } from "react";
import cx from "classnames";
import s from "./LookingForWidget.module.scss";

import CheckboxWidget from "../../../../../../components/CheckboxWidget/CheckboxWidget";
import ToggleWidget from "../../../../../../components/ToggleWidget/ToggleWidget";

export default function LookingForWidget({
	data,
	updateModel = () => {},
	titleClassName = "",
}) {
	const [show, setShow] = useState(true);
	const [selected, setSelected] = useState({});
	const [options, setOptions] = useState([]);

	// INIT
	useEffect(() => {
		const optionsList = data?.value || [];

		let select = {};
		optionsList.forEach((opt) => (select[opt] = true));

		setSelected(select);
		setOptions(optionsList);
		setShow(data?.show);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data]);

	const toggleSelection = (name, isSelected) => {
		setSelected({ ...selected, [name]: isSelected });
		updateModel({ ...data, value: options.filter((name) => selected[name]) });
	};

	const toggleShow = (isVisible) => {
		setShow(isVisible);

		updateModel({
			...data,
			show: isVisible,
		});
	};

	const labelStyles = {
		cursor: "pointer",
		marginLeft: 2,
		userSelect: "none",
		fontFamily: "Poppins",
		fontWeight: "400",
		color: "#FFF",
		fontSize: "16px",
	};

	return (
		<div className={s.root}>
			<div className={s.sectionHeader}>
				<div className={cx(s.title, titleClassName)}>Looking For</div>
				<ToggleWidget isVisible={show} onToggle={toggleShow} />
			</div>

			<div className={s.items}>
				{options.map((name, index) => (
					<div key={index} className={s.item}>
						<CheckboxWidget
							checked={selected[name]}
							disabled={!show}
							onChange={(isSelected) => toggleSelection(name, isSelected)}
							labelStyle={
								show ? labelStyles : { ...labelStyles, color: "#78909c" }
							}
							label={name}
						/>
					</div>
				))}
			</div>
		</div>
	);
}
