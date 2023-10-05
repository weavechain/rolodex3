import React, { useEffect } from "react";
import { useMetaMask } from "metamask-react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

import AppConfig from "../../AppConfig";
import waitingGif from "../../assets/images/general/waiting.gif";
import s from "./MetamaskWaitingPage.module.scss";

import Header from "../../components/Header/Header";
import AppRoutes from "../../helpers/AppRoutes";

export default function MetamaskWaitingPage() {
	const history = useHistory();
	const { status, connect } = useMetaMask();

	const { user: profile } = useSelector((state) => state.user);

	useEffect(() => {
		if (status === "connected") {
			history.push(profile ? AppRoutes.home : AppRoutes.profile);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [status]);

	// ------------------------------------- METHODS -------------------------------------
	const connectToMetamask = () => {
		connect().then(() => {
			// Check if user has profile created
			history.push(profile ? AppRoutes.home : AppRoutes.profile);
		});
	};

	return (
		<div className={s.root}>
			<Header title="Launching Metamask" showBack />

			<div className={s.content}>
				<div className={s.title}>Waiting for Metamask...</div>

				<div className={s.imageContainer}>
					<img src={waitingGif} alt="logo" />
				</div>

				<div className={s.login}>
					<p>
						If it doesn't launch{" "}
						<span
							href={AppConfig.METAMASK_DOWNLOAD_URL}
							onClick={connectToMetamask}
						>
							click here
						</span>
					</p>
				</div>
			</div>
		</div>
	);
}
