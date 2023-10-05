import React from "react";
import { useMetaMask } from "metamask-react";
import { showMetamaskLogin } from "../../../helpers/Utils";

import s from "./MetamaskAccountWidget.module.scss";

import CopyTextWidget from "../../CopyTextWidget/CopyTextWidget";
import MetamaskConnectButton from "./MetamaskConnectButton";

export default function MetamaskAccountWidget({
	hideInfo,
	callback = () => {},
}) {
	const { account } = useMetaMask();

	return (
		<div className={s.root}>
			<div className={s.title}>Wallet Address</div>
			{!showMetamaskLogin ? null : account ? (
				<CopyTextWidget text={account} />
			) : (
				<MetamaskConnectButton hideInfo={hideInfo} callback={callback} />
			)}
		</div>
	);
}
