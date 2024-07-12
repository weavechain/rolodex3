import React, { useEffect, useState } from "react";
import cx from "classnames";
import moment from "moment";

import s from "./BirthdayComputationWidget.module.scss";

import GenericSelector from "../../../../../../components/selectors/GenericSelector/GenericSelector";

const OPTIONS = [
	{ value: "MMM DD", label: "Month & Day" },
	{ value: "MMM DD, YYYY", label: "Month, Day, & Year" },
	{ value: "hide", label: "Hide" },
];

export default function BirthdayComputationWidget({
	profile,
	updateModel = () => { },
	titleClassName = "",
}) {
	const [format, setFormat] = useState(profile?.birthday?.displayText && profile?.birthday?.displayText.includes(',') ? OPTIONS[1].value : OPTIONS[0].value);
	const [displayText, setDisplayText] = useState("");

	// INIT
	useEffect(() => {
		if (!profile || !profile.birthday) return;

		if (profile.birthday.show === "false" || profile.birthday.show === false) {
			setFormat(OPTIONS[2].value);
		} else {
			setFormat(profile.birthday.displayText?.includes(",") ? OPTIONS[1].value : OPTIONS[0].value);
		}
		setDisplayText(profile.birthday?.displayText);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [profile]);

	useEffect(() => {
		if (!profile.birthday?.value)
			return;

		let dt;
		if (format === "hide") {
			dt = profile.birthday.displayText;
			setDisplayText(dt);
		} else {

			dt = moment(profile.birthday.value).format(format);
			setDisplayText(dt);
		}

		let newBirthdayField = {
			show: format !== "hide",
			value: profile.birthday?.value,
			displayText: dt,
		};

		if (newBirthdayField !== profile.birthday)
			updateModel(newBirthdayField);
	}, [format])

	return (
		<div className={s.root}>
			<div className={s.sectionHeader}>
				<div className={cx(s.title, titleClassName)}>Birthday</div>

				<GenericSelector
					className={s.selector}
					value={format}
					options={OPTIONS}
					onSelect={setFormat}
					placeholder="Choose one"
				/>
			</div>

			<div
				className={cx(s.sectionText, {
					[s.restricted]: !profile?.birthday?.show,
				})}
			>
				{displayText}
			</div>
		</div>
	);
}
