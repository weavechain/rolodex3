import React, { useEffect, useState } from "react";
import { useMetaMask } from "metamask-react";
import { useHistory } from "react-router-dom";

import AppConfig from "../../AppConfig";
import waitingGif from "../../assets/images/general/waiting.gif";
import s from "./MetamaskWaitingPage.module.scss";

import Header from "../../components/Header/Header";
import AppRoutes from "../../helpers/AppRoutes";
import { getCoreProfileByEthAddress } from "../../_redux/actions/directories";
import { useDispatch } from "react-redux";
import { ActionTypes } from "../../_redux/constants";

export default function MetamaskWaitingPage() {
	const history = useHistory();
	const { status, connect } = useMetaMask();

	const [, setMetamaskAccount] = useState("");
	const dispatch = useDispatch();

	useEffect(() => {
		console.log("Onload effect, status = " + status);
		if (status === "connected") {
			getProfileFromMetamaskConnectedActiveAccount();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [status]);


	const getProfileFromMetamaskConnectedActiveAccount = async () => {
		let ethAccounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
		const ethAccount = ethAccounts[0];
		window.ethereum.on('accountsChanged', function (accounts) {
			window.alert("Metamask active account changed!!");
			getProfileFromMetamaskConnectedActiveAccount();
		});
		setMetamaskAccount(ethAccount);

		const loadedDbProfile = await getCoreProfileByEthAddress(ethAccount);
		if (!loadedDbProfile || loadedDbProfile === "") {
			console.log("Pushing /profile");
			
			history.push({
				pathname: AppRoutes.profile,
				state: {
					from: "waiting", // need this for the Back Button on directory details
				},
			});
			return null;
		}
		dispatch({
			type: ActionTypes.LOAD_CORE_PROFILE,
			coreProfile: loadedDbProfile,
		});
		history.push(AppRoutes.home);
	}

	// ------------------------------------- METHODS -------------------------------------
	const connectToMetamask = () => {
		connect();
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
