import React from "react";
import { Button } from "reactstrap";
import { useHistory } from "react-router-dom";

import s from "./ProfileInfoPage.module.scss";

import ArrowRightIcon from "../../../components/icons/ArrowRightIcon";
import Header from "../../../components/Header/Header";
import VisibleIcon from "../../../components/icons/VisibleIcon";
import PartiallyVisibleIcon from "../../../components/icons/PartiallyVisibleIcon";
import ConfidentialIcon from "../../../components/icons/ConfidentialIcon";
import HiddenIcon from "../../../components/icons/HiddenIcon";
import AppRoutes from "../../../helpers/AppRoutes";

export default function ProfileInfoPage() {
	const history = useHistory();

	// ------------------------------------- METHODS -------------------------------------
	const goToCreateProfile = () => {
		history.push(AppRoutes.profile);
	};

	return (
		<div className={s.root}>
			<Header title="Set up New Account" showBack />

			<div className={s.content}>
				<div className={s.infoCard}>
					<p className={s.value}>Self-Sovereign Data Means</p>
					<p className={s.text}>
						All data is stored encrypted with a key known only to you (proxy
						re-encryption)
					</p>
					<p className={s.text}>
						You decide which directories to grant access to which pieces of
						information in the final step, where you can customize visibility
						for any data.
					</p>
				</div>

				<div className={s.textContainer}>
					<p className={s.title}>All fields can be...</p>

					<div className={s.infoLine}>
						<HiddenIcon />
						<span className={s.text}>Fully hidden</span>
					</div>
					<div className={s.infoLine}>
						<ConfidentialIcon />
						<span className={s.text}>
							Available for confidential compute only
						</span>
					</div>
					<div className={s.infoLine}>
						<PartiallyVisibleIcon />
						<span className={s.text}>Partially visible</span>
					</div>
					<div className={s.infoLine}>
						<VisibleIcon />
						<span className={s.text}>Fully visible</span>
					</div>
				</div>

				<div className={s.buttons}>
					<Button
						className={s.button}
						color="primary"
						onClick={goToCreateProfile}
					>
						Got it <ArrowRightIcon />
					</Button>
				</div>
			</div>
		</div>
	);
}
