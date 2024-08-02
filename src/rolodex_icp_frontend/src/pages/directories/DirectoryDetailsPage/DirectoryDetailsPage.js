import React, { useEffect, useState } from "react";
import cx from "classnames";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import { pluralize } from "../../../helpers/Utils";

// ACTIONS
import { getAvgAge, getMemberCountByDirectoryId, setCurrentDirectory, setUserProfileForDirectory } from "../../../_redux/actions/directories";

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

	const { directories = [], } = useSelector((state) => state.directories);
	const directory = directories.find((d) => d.directoryId === id);

	const userId = useSelector(state => state.user?.coreProfile?.userId);

	let [pieData, setPieData] = useState(null);
	let [avgAge, setAvgAge] = useState(".");

	let avgLoadingText = ".";
	let loadedAvg = false;
	let [intervall, setIntervall] = useState(null);

	useEffect(() => {
		const i = setInterval(() => updateUi(), 500);
		setIntervall(i);
	}, []);

	const updateUi = () => {
		if (!loadedAvg) {
			setAvgAge(avgLoadingText);
			avgLoadingText = avgLoadingText + '.';
		} else {
			clearInterval(intervall);
		}
	};

	let [hasJoined, setHasJoined] = useState(false);
	let [membersCount, setMembersCount] = useState(0);

	useEffect(() => {
		getAvgAge(directory.directoryId)
			.then(avg => {
				loadedAvg = true;
				setAvgAge(avg)
			});
	}, []);

	useEffect(() => {
		dispatch(setUserProfileForDirectory(userId, id))
			.then(r => setHasJoined(r ? true : false));
	}, []);

	useEffect(() => {
		if (!directory)
			return;
		getMemberCountByDirectoryId(directory.directoryId)
			.then(c => setMembersCount(c));
	}, []);


	if (!directory) {
		history.push(AppRoutes.welcome);
		return null;
	}

	// ------------------------------------- METHODS -------------------------------------
	const joinDirectory = () => {
		dispatch(setCurrentDirectory(directory)).then(() => {
			history.push(!userId ? AppRoutes.profileInfo : AppRoutes.profile);
		});
	};

	const goBack = () => {
		if (comingFromOnboarding)
			history.push(AppRoutes.home);
		else
			history.goBack()
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
							url: `${AppRoutes.directories}/${directory.directoryId}/members`,
						},
						{
							name: "My Dir. Profile",
							url: `${AppRoutes.directories}/${directory.directoryId}/profile`,
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
					<img src={`data:image/svg+xml;utf8,${encodeURIComponent(directory.icon_svg)}`} alt="..." />
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
						<div className={s.value}>{avgAge}</div>
					</div>
					<div className={s.panel}>
						<div className={s.label}>
							<img src={SushiIcon} alt="..." />
							FAVORITE SUSHI
						</div>
						<div className={s.value}>{directory.favorite_sushi}</div>
					</div>
				</div>

				{
					pieData !== null
						? <SimplePieChart pieData={pieData} title="Looking for..." />
						: null
				}
			</div>

			<Footer
				showFooter
				page={hasJoined ? AppRoutes.myDirectories : AppRoutes.directories}
			/>
		</div>
	);
}
