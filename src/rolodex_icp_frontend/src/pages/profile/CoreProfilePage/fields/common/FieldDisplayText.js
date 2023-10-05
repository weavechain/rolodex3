import React from "react";
import cx from "classnames";
import s from "./FieldDisplayText.module.scss";

import PencilIcon from "../../../../../components/icons/PencilIcon";
import PlusIcon from "../../../../../components/icons/PlusIcon";
import AppConfig from "../../../../../AppConfig";

export default function FieldDisplayText({ text, name, enterEditMode }) {
	return text ? (
		<div
			className={cx(s.root, {
				[s.blue]: ["linkedin", "twitter"].includes(name),
			})}
		>
			{name === "email" ? (
				<a href={`mailto:${text}`}>{text}</a>
			) : name === "linkedin" ? (
				<a href={text} target="_blank" rel="noreferrer">
					{text}
				</a>
			) : name === "twitter" ? (
				<a href={`${AppConfig.TWITTER_URL}${text}`}>{text}</a>
			) : (
				<span>{text}</span>
			)}
			{enterEditMode ? (
				<span className={s.icon} onClick={enterEditMode}>
					<PencilIcon />
				</span>
			) : null}
		</div>
	) : (
		<div className={cx(s.root, s.empty)} onClick={enterEditMode}>
			<PlusIcon />
			<span className={s.addText}>Add</span>
		</div>
	);
}
