import React from "react";

import s from "./AvatarWidget.module.scss";
import DefaultUserAvatar from "../icons/DefaultUserAvatar";

export default function AvatarWidget({ avatar }) {
	return (
		<div className={s.root}>
			{avatar ? <img src={avatar} alt="..." /> : <DefaultUserAvatar />}
		</div>
	);
}
