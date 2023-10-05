import React, { useState } from "react";
import { Button } from "reactstrap";
import { useMetaMask } from "metamask-react";
import { useHistory } from "react-router-dom";

import s from "./ProfileNotFoundPage.module.scss";
import Img from "../../../assets/images/general/not-found.svg";

import AppConfig from "../../../AppConfig";
import DownloadMetamaskDialog from "../../../components/metamask/DownloadMetamaskDialog/DownloadMetamaskDialog";
import LoginButtonsPanel from "../../../components/LoginButtonsPanel/LoginButtonsPanel";
import MetamaskCheckHelper from "../../../helpers/MetamaskCheckHelper";
import ArrowRightIcon from "../../../components/icons/ArrowRightIcon";
import Header from "../../../components/Header/Header";
import AppRoutes from "../../../helpers/AppRoutes";

export default function ProfileNotFoundPage() {
	const history = useHistory();
	const { status, connect } = useMetaMask();

	const [showDownloadDialog, setShowDownloadDialog] = useState(false);
	const [downloadStarted, setDownloadStarted] = useState(false);

	const showDownloadMetamask = status === "unavailable";

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

	const goToProfilePage = () => {
		history.push(AppRoutes.profileInfo);
	};

	const downloadMetamask = () => {
		setShowDownloadDialog(false);
		setDownloadStarted(true);
		window.open(AppConfig.METAMASK_DOWNLOAD_URL, "_blank");
	};

	return (
		<div className={s.root}>
			<Header title="Profile not found" showBack />

			<MetamaskCheckHelper triggered={downloadStarted} />

			{showDownloadDialog ? (
				<DownloadMetamaskDialog
					onContinue={downloadMetamask}
					close={() => setShowDownloadDialog(false)}
				/>
			) : null}

			<div className={s.content}>
				<div className={s.imageContainer}>
					<img src={Img} alt="logo" />
				</div>

				<div className={s.textContainer}>
					<p className={s.value}>Sorry!</p>
					<p className={s.text}>
						Sorry! We don't recognize an a profile associated with that email
						address...
					</p>
				</div>

				<div className={s.buttons}>
					<Button
						className={s.button}
						color="primary"
						onClick={goToProfilePage}
					>
						New Account <ArrowRightIcon />
					</Button>
				</div>

				<LoginButtonsPanel onLogin={onLogin} loginText="Try Another Email" />
			</div>
		</div>
	);
}
