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
	updateModel = () => {},
	titleClassName = "",
}) {
	const [format, setFormat] = useState(OPTIONS[0].value);
	const [displayText, setDisplayText] = useState(profile?.displayText?.value);

	// INIT
	useEffect(() => {
		if (!profile || !format) return;

		const birth = profile.birthday?.value;
		const dt = format === "hide" ? displayText : moment(birth).format(format);

		if (dt) {
			setDisplayText(dt);

			updateModel({
				show: format !== "hide",
				value: profile.birthday?.value,
				displayText,
			});
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [format]);

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
