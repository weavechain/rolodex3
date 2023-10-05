import React, { useEffect, useState } from "react";
import cx from "classnames";

import s from "./AddressComputationWidget.module.scss";

import AddressSelector from "../../../selectors/AddressSelector/AddressSelector";
import CheckboxWidget from "../../../CheckboxWidget/CheckboxWidget";
import ConfidentialComputingDialog from "../../../ConfidentialComputingDialog/ConfidentialComputingDialog";

export default function AddressComputationWidget({
	profile,
	updateModel = () => {},
}) {
	const [isComputational, setIsComputational] = useState(false);
	const [format, setFormat] = useState(null);
	const [displayText, setDisplayText] = useState("");

	const { city, state, country, address } = profile;

	useEffect(() => {
		if (profile?.address?.show) {
			setFormat(profile?.address.show);
		} else {
			setFormat("city, state, & country");
		}
	}, [profile?.address]);

	useEffect(() => {
		if (!format) return;

		const dt =
			format === "country"
				? profile.country?.value
				: format === "hide"
				? address?.value
				: [city?.value, state?.value, country?.value].join(", ");

		setDisplayText(dt);

		if (dt) {
			updateModel({
				show: format,
				value: dt,
				compute: isComputational,
			});
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [format]);

	// ------------------------------------- METHODS -------------------------------------
	const updateComputation = () => {
		const oldAddress = profile.address || {};

		updateModel({ ...oldAddress, compute: !isComputational });
		setIsComputational(!isComputational);
	};

	return (
		<div className={s.root}>
			<div className={s.sectionHeader}>
				<div className={s.title}>Address</div>
				<AddressSelector
					className={s.selector}
					value={format}
					onSelect={setFormat}
				/>
			</div>
			<div
				className={cx(s.sectionText, {
					[s.restricted]: profile?.address?.show === "hide",
				})}
			>
				{displayText}
			</div>
			{format === "hide" || format === "country" ? (
				<div className={s.computation}>
					<CheckboxWidget
						checked={isComputational}
						onChange={updateComputation}
						label={"Make full address available for Confidential Compute"}
					/>
					<ConfidentialComputingDialog />
				</div>
			) : null}
		</div>
	);
}
