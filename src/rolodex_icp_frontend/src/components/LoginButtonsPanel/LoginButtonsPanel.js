import React from "react";

import { showMetamaskLogin } from "../../helpers/Utils";

import s from "./LoginButtonsPanel.module.scss";

import FoxIcon from "../icons/FoxIcon";
import EmailIcon from "../icons/EmailIcon";
import AppRoutes from "../../helpers/AppRoutes";

export default function LoginButtonsPanel({
	onLogin,
	loginText = "Login with Email",
}) {
	return (
		<div className={s.root}>
			<p className={s.info}>or</p>
			{showMetamaskLogin ? (
				<div className={s.panel} onClick={onLogin}>
					<FoxIcon />
					<p className={s.text}>Connect with Metamask</p>
				</div>
			) : null}

			<a className={s.panel} href={`#${AppRoutes.login}`}>
				<EmailIcon />
				<p className={s.text}>{loginText}</p>
			</a>
		</div>
	);
}
