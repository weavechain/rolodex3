import React, { useEffect, useState } from "react";
import cx from "classnames";

import s from "./AddressComputationWidget.module.scss";

import AddressSelector from "../../../../../../components/selectors/AddressSelector/AddressSelector";

export default function AddressComputationWidget({
	profile,
	updateModel = () => {},
	titleClassName,
}) {
	const [format, setFormat] = useState(
		profile?.address?.show || "city, state, & country"
	);
	const [displayText, setDisplayText] = useState("");

	useEffect(() => {
		if (!profile?.country || !format) return;
		const { city, state, country, address } = profile;

		const value =
			format === "country"
				? profile.country?.value
				: format === "hide"
				? address?.value
				: [city?.value, state?.value, country?.value].join(", ");

		setDisplayText(value);

		if (!value) return;

		updateModel({ show: format !== "hide", value });

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [format, profile.country]);

	// ------------------------------------- METHODS -------------------------------------
	return (
		<div className={s.root}>
			<div className={s.sectionHeader}>
				<div className={cx(s.title, titleClassName)}>Address</div>
				<AddressSelector
					className={s.selector}
					value={format}
					onSelect={setFormat}
				/>
			</div>
			<div
				className={cx(s.sectionText, {
					[s.restricted]: !profile?.address?.show,
				})}
			>
				{displayText}
			</div>
		</div>
	);
}
