import React, { useState } from "react";
import { useMetaMask } from "metamask-react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

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
	const { status } = useMetaMask();

	const [showDownloadDialog, setShowDownloadDialog] = useState(false);
	const [downloadStarted, setDownloadStarted] = useState(false);

	const { directories } = useSelector(state => state.directories);
	const showDownloadMetamask = status === "unavailable";

	const profile = useSelector(state => state.user);

	if (profile.user) {
		// setTimeout(() => {
			history.push(AppRoutes.home);
		// }, 0);
		return null;
	}

	// ------------------------------------- METHODS -------------------------------------
	const connectToMetamask = () => {
		// connect();
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

	const createCoreProfileAndJoinCoreDir = () => {
		const coreDirectoryId = directories ? directories[0].directoryId : null;
		history.push(`${AppRoutes.directories}/${coreDirectoryId}`);
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
					text="Join Directory"
					onClick={createCoreProfileAndJoinCoreDir}
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
