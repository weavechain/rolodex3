import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import s from "./MyDirectoriesPage.module.scss";

import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";

import AppRoutes from "../../../helpers/AppRoutes";
import DirectoriesList from "../../../components/DirectoriesList/DirectoriesList";
import RoloSearch from "../../../components/RoloSearch/RoloSearch";

export default function MyDirectoriesPage() {
	const [data, setData] = useState([]);
	const { directories = [] } = useSelector((state) => state.directories);

	const myDirectories = directories.filter((d) => !!d.profile);

	useEffect(() => {
		setData(myDirectories);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	React.useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	// ------------------------------------- METHODS -------------------------------------

	return (
		<div className={s.root}>
			<Header title="My Directories" />

			<div className={s.content}>
				<DirectoriesList directories={data} />
			</div>

			<Footer
				page={AppRoutes.myDirectories}
				search={<RoloSearch data={myDirectories} setData={setData} />}
			/>
		</div>
	);
}
