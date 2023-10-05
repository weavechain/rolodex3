import React, { useState } from "react";
import { useMetaMask } from "metamask-react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { setCurrentDirectory } from "../../_redux/actions/directories";

import s from "./WelcomePage.module.scss";

import AppConfig from "../../AppConfig";
import LogoImg from "../../assets/images/general/RoloDEX-Logo.svg";
import PoweredByImg from "../../assets/images/general/powered-by.svg";
import DownloadMetamaskDialog from "../../components/metamask/DownloadMetamaskDialog/DownloadMetamaskDialog";
import LoginButtonsPanel from "../../components/LoginButtonsPanel/LoginButtonsPanel";
import MetamaskCheckHelper from "../../helpers/MetamaskCheckHelper";
import RoloButton from "../../components/RoloButton/RoloButton";
import AppRoutes from "../../helpers/AppRoutes";

export default function WelcomePage() {
	const history = useHistory();
	const dispatch = useDispatch();
	const { status, connect } = useMetaMask();

	const [showDownloadDialog, setShowDownloadDialog] = useState(false);
	const [downloadStarted, setDownloadStarted] = useState(false);

	const { directories } = useSelector((state) => state.directories);
	const showDownloadMetamask = status === "unavailable";

	const { CORE_DIRECTORY } = useSelector((state) => state.directories);
	const profile = CORE_DIRECTORY?.profile;

	if (profile) {
		setTimeout(() => {
			history.push(AppRoutes.home);
		}, 0);
		return null;
	}

	// ------------------------------------- METHODS -------------------------------------
	const connectToMetamask = () => {
		connect();
		history.push(AppRoutes.metamask);
	};

	const onLogin = () => {
		// Not installed
		if (showDownloadMetamask) {
			setShowDownloadDialog(true);
		} else {
			connectToMetamask();
		}
	};

	const downloadMetamask = () => {
		setShowDownloadDialog(false);
		setDownloadStarted(true);
		window.open(AppConfig.METAMASK_DOWNLOAD_URL, "_blank");
	};

	const joinDirectory = () => {
		const directory = directories ? directories[0] : {};
		// TODO: Set current directory WEV
		dispatch(setCurrentDirectory(directory));

		history.push(`${AppRoutes.directories}/${directory.id}`);
	};

	return (
		<div className={s.root}>
			<MetamaskCheckHelper triggered={downloadStarted} />

			{showDownloadDialog ? (
				<DownloadMetamaskDialog
					onContinue={downloadMetamask}
					close={() => setShowDownloadDialog(false)}
				/>
			) : null}

			<div className={s.content}>
				<div className={s.imageContainer}>
					<img src={LogoImg} alt="logo" />
				</div>

				<RoloButton
					text="Get Started"
					onClick={joinDirectory}
					className={s.button}
				/>

				<LoginButtonsPanel onLogin={onLogin} />

				<div className={s.poweredBy}>
					<img src={PoweredByImg} alt="..." />
				</div>
			</div>
		</div>
	);
}
