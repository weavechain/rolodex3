import React, { useEffect, useState } from "react";
import cx from "classnames";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import { pluralize } from "../../../helpers/Utils";

// ACTIONS
import { getMemberCountByDirectoryId, getMembersByDirectoryId, setCurrentDirectory, setUserProfileForDirectory } from "../../../_redux/actions/directories";

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
	const loggedInUser = useSelector(state => state.user);
	const directory = directories.find((d) => d.id === id);

	let [pieData, setPieData] = useState(null);

	useEffect(() => {
		getMembersByDirectoryId(directory.id)
			.then(members => {
				let membersCount = members.length;

				// TODO: 

				let countNetworking = 0;
				let countInvestors = 0;
				let countCollaborators = 0;
				let countInterests = 0;

				for (let i = 0; i < membersCount; i++) {
					if (!members[i]?.lookingFor)
						continue;
					let currLookingFor = JSON.parse(members[i].lookingFor).value;
					if (currLookingFor.includes("Networking"))
						countNetworking++;
					if (currLookingFor.includes("Investors"))
						countInvestors++;
					if (currLookingFor.includes("Collaborators"))
						countCollaborators++;
					countInterests += currLookingFor.length;
				}

				let _data = [
					{
						name: "Networking", value: countNetworking / countInterests * 100
					},
					{
						name: "Investors", value: countInvestors / countInterests * 100
					},
					{
						name: "Collaborators", value: countCollaborators / countInterests * 100
					},
				];
				setPieData(_data);
			})
	}, []);

	useEffect(() => {
		const userId = loggedInUser.user
			? loggedInUser.user.id // user existed in DB
			: undefined; // user doesn't exist, clicked "Get Started"
		dispatch(setUserProfileForDirectory(userId, id))
			.then(r => setHasJoined(r));
	}, []);

	let [hasJoined, setHasJoined] = useState(false);
	let [membersCount, setMembersCount] = useState(0);

	useEffect(() => {
		if (!directory)
			return;
		getMemberCountByDirectoryId(directory.id)
			.then(c => setMembersCount(c));
	}, []);


	if (!directory) {
		history.push(AppRoutes.welcome);
		return null;
	}

	// ------------------------------------- METHODS -------------------------------------
	const joinDirectory = () => {
		dispatch(setCurrentDirectory(directory)).then(() => {
			history.push(loggedInUser ? AppRoutes.profileInfo : AppRoutes.profile);
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
