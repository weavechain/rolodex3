import React from "react";
import { useHistory } from "react-router";
import { useSelector } from "react-redux";

import s from "./HomePage.module.scss";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

import DirectoriesWidget from "./DirectoriesWidget/DirectoriesWidget";
import RoloButton from "../../components/RoloButton/RoloButton";
import AppRoutes from "../../helpers/AppRoutes";
import AvatarWidget from "../../components/AvatarWidget/AvatarWidget";

export default function HomePage() {
	const history = useHistory();

	const { directories } = useSelector(
		(state) => state.directories
	);
	const { user: profile = {} } = useSelector(state => state.user);
	const myDirectories = []; //directories.filter((d) => !!d.profile);

	const name =
		profile?.name?.value ||
		profile?.nickname?.value ||
		profile?.email?.value ||
		"user";

	// ------------------------------------- METHODS -------------------------------------
	const goToDirectories = () => {
		history.push(AppRoutes.directories);
	};

	return (
		<div className={s.root}>
			<Header className={s.header}>
				<p className={s.title}>{`Hi, ${name}!`}</p>
			</Header>

			<div className={s.content}>
				{
					profile
						? (<a className={s.avatarContainer} href={`#${AppRoutes.profile}/core`}>
							<AvatarWidget avatar={profile.avatar?.value} />
							<p>Edit profile</p>
						</a>)
						: null
				}

				{/* DIRECTORIES */}
				<div className={s.directories}>
					<DirectoriesWidget
						directories={directories}
						titleLink={AppRoutes.directories}
					/>
				</div>

				<div className={s.directories}>
					<DirectoriesWidget
						directories={myDirectories}
						title="My Directories"
					/>
				</div>

				<div className={s.buttons}>
					<RoloButton
						text="Browse & Join Directories"
						onClick={goToDirectories}
					/>
				</div>
			</div>

			<Footer page="/" />
		</div>
	);
}
