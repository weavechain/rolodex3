import React, { useEffect, useState } from "react";
import { Button } from "reactstrap";
import { useParams, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

import { loadUserFromMagicLink } from "../../../_redux/actions/user";

import s from "./LoginPage.module.scss";

import AppHelper from "../../../helpers/AppHelper";
import ArrowRightIcon from "../../../components/icons/ArrowRightIcon";
import Header from "../../../components/Header/Header";
import Img from "../../../assets/images/general/login.svg";
import InputWidget from "../../../components/InputWidget/InputWidget";
import AppRoutes from "../../../helpers/AppRoutes";

export default function LoginPage() {
	const history = useHistory();
	const dispatch = useDispatch();
	const [email, setEmail] = useState("");
	const [isMandatory] = useState(true);
	const [emailWasSent, setEmailWasSent] = useState(false);

	const { urlEmail, urlToken } = useParams() || {};
	// /const { user } = useSelector((state) => state.user);

	// MAGIC LINK DETECTION
	useEffect(() => {

		if (urlToken) {
			dispatch(loadUserFromMagicLink(urlEmail, urlToken))
				.then(user => history.push(user ? AppRoutes.home : AppRoutes.profileInfo));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [urlToken]);

	// ------------------------------------- METHODS -------------------------------------
	const sendLoginLink = () => {
		AppHelper.sendMagicLink(email).then(() => {
			setEmailWasSent(true);
		});
	};

	return (
		<div className={s.root}>
			<Header title="Welcome Back!" showBack />

			<div className={s.container}>
				<div className={s.imageContainer}>
					<img src={Img} alt="logo" />
				</div>

				{emailWasSent ? (
					<div className={s.textContainer}>
						<p className={s.text}>Link Sent to</p>
						<p className={s.value}>{email}!</p>
						<p className={s.text}>Click on the link in your email to login</p>
					</div>
				) : (
					<>
						<InputWidget
							isMandatory={isMandatory}
							title="Email"
							value={email || ""}
							placeholder="ex. jim@me.com"
							label="We'll send you a link you can use to log in"
							onChange={setEmail}
							validationRegex="^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$"
						/>

						<div className={s.buttons}>
							<Button
								className={s.button}
								color="primary"
								onClick={sendLoginLink}
								disabled={isMandatory && !email}
							>
								Send me a link to log in <ArrowRightIcon />
							</Button>
						</div>
					</>
				)}
			</div>
		</div>
	);
}
