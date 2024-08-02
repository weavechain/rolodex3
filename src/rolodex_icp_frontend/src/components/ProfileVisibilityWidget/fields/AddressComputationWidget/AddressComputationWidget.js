import React, { useEffect, useState } from "react";
import cx from "classnames";

import s from "./AddressComputationWidget.module.scss";

import AddressSelector from "../../../selectors/AddressSelector/AddressSelector";
import CheckboxWidget from "../../../CheckboxWidget/CheckboxWidget";
import ConfidentialComputingDialog from "../../../ConfidentialComputingDialog/ConfidentialComputingDialog";

export default function AddressComputationWidget({
	profile,
	updateModel = () => { },
}) {
	const [isComputational, setIsComputational] = useState(false);
	const [displayText, setDisplayText] = useState(null);
	const [format, setFormat] = useState(null);

	useEffect(() => {
		if (!profile?.country?.value && !profile?.state?.value && !profile?.city?.value)
			return;

		let _format = computeOrDefault();
		setFormat(_format);
		if (_format === "hide") {
			setDisplayText(profile.address.displayText);
			return;
		}

		const dt = _format === "country"
			? profile.country?.value
			: _format === "hide"
				? profile.address.displayText
				: [profile.city?.value, profile.state?.value, profile.country?.value].join(", ");
		updateModel({
			compute: isComputational,
			show: _format !== "hide",
			displayText: displayText,
			value: dt
		});
	}, []);

	useEffect(() => {
		if (!profile?.country?.value && !profile?.state?.value && !profile?.city?.value)
			return;

		let _format = computeOrDefault();
		setFormat(_format);

		if (_format === "hide") {
			setDisplayText(profile.address.displayText);
			return;
		}

		const dt = _format === "country"
			? profile.country?.value
			: _format === "hide"
				? profile.address.displayText
				: [profile.city?.value, profile.state?.value, profile.country?.value].join(", ");

		setDisplayText(dt);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [profile]);

	const computeOrDefault = () => {
		if (profile.address?.show === "false" || profile.address?.show === false)
			return "hide";
		if (profile.address?.value?.includes(','))
			return "city, state, & country";
		return "country";
	}


	const updateFormat = (f) => {
		if (!f) return;

		const dt = f === "hide"
			? displayText
			: f === "country"
				? profile.country?.value
				: [profile.city?.value, profile.state?.value, profile.country?.value].join(", ");
		setFormat(f);

		if (dt) {
			updateModel({
				compute: isComputational,
				show: f !== "hide",
				displayText: displayText,
				value: dt,
			});
		}
	};

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
					onSelect={updateFormat}
				/>
			</div>
			<div
				className={cx(s.sectionText, {
					[s.restricted]: !profile?.address?.show || profile?.address?.show === false || profile?.address?.show === "false",
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
