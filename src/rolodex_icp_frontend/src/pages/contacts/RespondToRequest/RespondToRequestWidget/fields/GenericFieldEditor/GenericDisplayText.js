import React from "react";
import cx from "classnames";
import s from "./GenericDisplayText.module.scss";

import AppConfig from "../../../../../../AppConfig";

export default function GenericDisplayText({ text, name, show }) {
	return (
		<div
			className={cx(s.root, {
				[s.blue]: ["linkedin", "twitter"].includes(name),
				[s.restricted]: !show,
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
		</div>
	);
}
