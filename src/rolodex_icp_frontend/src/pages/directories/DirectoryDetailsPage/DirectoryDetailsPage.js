import React from "react";
import cx from "classnames";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import { pluralize } from "../../../helpers/Utils";

// ACTIONS
import { setCurrentDirectory } from "../../../_redux/actions/directories";

import s from "./DirectoryDetailsPage.module.scss";

import Header from "../../../components/Header/Header";
import RoloButton from "../../../components/RoloButton/RoloButton";
import AppRoutes from "../../../helpers/AppRoutes";

import CakeIcon from "../../../assets/images/general/cake.svg";
import SushiIcon from "../../../assets/images/general/sushi.svg";
import SimplePieChart from "../../../components/charts/SimplePieChart";
import TabsWidget from "../../../components/TabsWidget/TabsWidget";
import Footer from "../../../components/Footer/Footer";

export default function DirectoryDetailsPage(props) {
	const dispatch = useDispatch();
	const history = useHistory();
	const { id } = useParams() || {};

	const comingFromOnboarding = history.location.state?.from === "onboarding";

	const {
		directories = [],
		CORE_DIRECTORY,
		CORE_PROFILE,
	} = useSelector((state) => state.directories);
	const directory = directories.find((d) => d.id === id);

	if (!directory) {
		history.push(AppRoutes.welcome);
		return null;
	}

	const hasJoined =
		!!directory.profile ||
		(CORE_DIRECTORY?.profile && directory.id === CORE_DIRECTORY?.id);

	const membersCount = directory.members?.length;

	// ------------------------------------- METHODS -------------------------------------
	const joinDirectory = () => {
		dispatch(setCurrentDirectory(directory)).then(() => {
			history.push(!CORE_PROFILE ? AppRoutes.profileInfo : AppRoutes.profile);
		});
	};

	const goBack = () => {
		history.push(comingFromOnboarding ? AppRoutes.home : AppRoutes.directories);
	};

	return (
		<div className={s.root}>
			<Header title="Directory Details" goBack={goBack} />

			{hasJoined ? (
				<TabsWidget
					tabs={[
						{ name: "About", url: "", isActive: true },
						{
							name: "Members",
							url: `${AppRoutes.directories}/${directory.id}/members`,
						},
						{
							name: "My Dir. Profile",
							url: `${AppRoutes.directories}/${directory.id}/profile`,
						},
					]}
				/>
			) : null}

			<div className={s.content}>
				<div
					className={cx(s.image, {
						[s.whiteBg]: directory.name === "EthGlobal Paris 2023",
					})}
				>
					<img src={directory.icon} alt="..." />
				</div>

				<div className={s.info}>
					<div className={s.name}>{directory.name}</div>
					<div className={s.text}>{pluralize("member", membersCount)}</div>
					<div className={s.text}>Est. {directory.established_date}</div>
					<div className={s.description}>{directory.description}</div>
				</div>

				{hasJoined ? null : (
					<RoloButton
						text="Join Directory Now!"
						onClick={joinDirectory}
						className={s.button}
					/>
				)}

				<div className={s.details}>
					<div className={s.panel}>
						<div className={s.label}>
							<img src={CakeIcon} alt="..." />
							AVG AGE
						</div>
						<div className={s.value}>{directory.average_age}</div>
					</div>
					<div className={s.panel}>
						<div className={s.label}>
							<img src={SushiIcon} alt="..." />
							FAVORITE SUSHI
						</div>
						<div className={s.value}>{directory.favorite_sushi}</div>
					</div>
				</div>

				<SimplePieChart data={directory.lookingForAgg} title="Looking for..." />
			</div>

			<Footer
				showFooter
				page={hasJoined ? AppRoutes.myDirectories : AppRoutes.directories}
			/>
		</div>
	);
}
