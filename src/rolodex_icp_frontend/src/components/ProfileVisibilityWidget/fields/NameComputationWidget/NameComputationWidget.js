import React, { useEffect, useState } from "react";
import cx from "classnames";

import s from "./NameComputationWidget.module.scss";
import NameSelector from "../../../../components/selectors/NameSelector/NameSelector";

export default function NameComputationWidget({
	profile,
	updateModel = () => {},
}) {
	const [format, setFormat] = useState("nickname");
	const [displayText, setDisplayText] = useState("");

	const { nickname, firstName, lastName } = profile;

	useEffect(() => {
		if (profile.name?.show) {
			setFormat(profile?.name.show);
		} else {
			setFormat("nickname");
		}
	}, [profile?.name]);

	useEffect(() => {
		if (!nickname || (!lastName && !firstName) || !format) return;

		const dt =
			format === "nickname"
				? nickname?.value
				: [firstName?.value, lastName?.value].join(" ");

		if (dt) {
			setDisplayText(dt);
			updateModel({ show: format, value: dt });
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [format, nickname, firstName, lastName]);

	// ------------------------------------- METHODS -------------------------------------
	return !displayText ? null : (
		<div className={s.root}>
			<div className={s.sectionHeader}>
				<div className={s.title}>Name</div>
				<NameSelector
					value={format}
					className={s.selector}
					onSelect={setFormat}
					useDarkTheme
				/>
			</div>
			<div
				className={cx(s.sectionText, {
					[s.restricted]: profile?.name?.show === false,
				})}
			>
				{displayText}
			</div>
		</div>
	);
}
