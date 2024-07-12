import React, { useEffect, useState } from "react";
import cx from "classnames";

import s from "./NameComputationWidget.module.scss";
import NameSelector from "../../../../../../components/selectors/NameSelector/NameSelector";

export default function NameComputationWidget({
	profile,
	updateModel = () => {},
	titleClassName = "",
}) {
	const [format, setFormat] = useState("nickname");
	const [displayText, setDisplayText] = useState("");

	useEffect(() => {
		if (!profile.nickname || !format) return;
		const { nickname, firstName, lastName } = profile;

		const value =
			format === "nickname"
				? nickname?.value
				: [firstName?.value, lastName?.value].join(" ");

		if (value) {
			setDisplayText(value);
			updateModel({ show: format, value });
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [format, profile.nickname]);

	// ------------------------------------- METHODS -------------------------------------
	return !displayText ? null : (
		<div className={s.root}>
			<div className={s.sectionHeader}>
				<div className={cx(s.title, titleClassName)}>Name</div>
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
