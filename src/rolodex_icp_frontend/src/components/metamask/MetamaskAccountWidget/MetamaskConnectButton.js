import React from "react";
import { Button } from "reactstrap";

import { useMetaMask } from "metamask-react";

import s from "./MetamaskAccountWidget.module.scss";
import FoxIcon from "../../icons/FoxIcon";
import ArrowRightIcon from "../../icons/ArrowRightIcon";

export default function MetamaskConnectButton({
	hideInfo,
	callback = () => {},
}) {
	const { connect } = useMetaMask();

	// ------------------------------------- METHODS -------------------------------------
	const connectToMetamask = () => {
		connect().then((data) => {
			callback(data[0]);
		});
	};

	return (
		<div className={s.root}>
			<Button className={s.button} color="primary" onClick={connectToMetamask}>
				<FoxIcon />
				Connect w Metamask <ArrowRightIcon />
			</Button>

			{hideInfo ? null : (
				<div className={s.label}>
					Connecting with Metamask makes Email an optional field
				</div>
			)}
		</div>
	);
}
