import React, { useEffect, useState } from "react";
import cx from "classnames";
import moment from "moment";

import s from "./BirthdayComputationWidget.module.scss";

import CheckboxWidget from "../../../../components/CheckboxWidget/CheckboxWidget";
import ConfidentialComputingDialog from "../../../../components/ConfidentialComputingDialog/ConfidentialComputingDialog";
import GenericSelector from "../../../../components/selectors/GenericSelector/GenericSelector";

const OPTIONS = [
	{ value: "MMM DD", label: "Month & Day" },
	{ value: "MMM DD, YYYY", label: "Month, Day, & Year" },
	{ value: "hide", label: "Hide" },
];

export default function BirthdayComputationWidget({
	profile,
	updateModel = () => { },
}) {
	const [isComputational, setIsComputational] = useState(false);
	const [displayText, setDisplayText] = useState(null);
	const [format, setFormat] = useState(null);

	const show = profile.birthday?.show;
	const value = profile.birthday?.value;

	useEffect(() => {
		if (!profile.birthday?.value)
			return;

		let _format = computeOrDefault();
		setFormat(_format);

		if (_format === "hide") {
			setDisplayText(profile.birthday.displayText);
			return;
		}


		const dt = moment(value).format(_format);
		setDisplayText(dt);
		updateModel({
			compute: isComputational,
			show: _format !== "hide",
			value,
			displayText: dt,
		})
	}, [])

	useEffect(() => {
		if (!profile.birthday?.value)
			return;

		let _format = computeOrDefault();
		setFormat(_format);

		if (_format === "hide") {
			setDisplayText(profile.birthday.displayText);
			return;
		}

		const dt = moment(value).format(_format);
		setDisplayText(dt);
	}, [profile])

	const computeOrDefault = () => {
		if (profile.birthday?.show === "false" || profile.birthday?.show === false)
			return OPTIONS[2].value;
		if (profile.birthday?.displayText?.includes(','))
			return OPTIONS[1].value;
		return OPTIONS[0].value;
	}

	// ------------------------------------- METHODS -------------------------------------
	const updateFormat = (f) => {
		if (!f) return;

		const dt = f === "hide" ? displayText : moment(value).format(f);
		setFormat(f);

		if (dt) {
			updateModel({
				compute: isComputational,
				show: f !== "hide",
				value,
				displayText: dt,
			});
		}
	};

	const updateComputation = () => {
		const oldData = profile.birthday || {};

		updateModel({ ...oldData, compute: !isComputational });
		setIsComputational(!isComputational);
	};

	return (
		<div className={s.root}>
			<div className={s.sectionHeader}>
				<div className={s.title}>Birthday</div>

				{format ? (
					<GenericSelector
						className={s.selector}
						value={format}
						options={OPTIONS}
						onSelect={updateFormat}
						placeholder="Choose one"
					/>
				) : null}
			</div>

			<div
				className={cx(s.sectionText, {
					[s.restricted]:
						!profile?.birthday?.show || profile?.birthday?.show === "false" || profile?.birthday?.show === false,
				})}
			>
				{displayText}
			</div>

			{format === "hide" || format === "MMM DD" ? (
				<div className={s.computation}>
					<CheckboxWidget
						checked={isComputational}
						onChange={updateComputation}
						label={"Make full birthday available for Confidential Compute"}
					/>
					<ConfidentialComputingDialog />
				</div>
			) : null}
		</div>
	);
}
