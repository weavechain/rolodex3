import React from "react";

import s from "./InfoCard.module.scss";

export default function InfoCard({ title, description, children }) {
	return (
		<div className={s.root}>
			<div className={s.container}>
				{title ? <div className={s.title}>{title}</div> : null}
				{description ? (
					<div className={s.description}>{description}</div>
				) : null}

				{children ? <>{children}</> : null}
			</div>
		</div>
	);
}
