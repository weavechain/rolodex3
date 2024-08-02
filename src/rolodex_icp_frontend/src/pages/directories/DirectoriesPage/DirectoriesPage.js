import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import s from "./DirectoriesPage.module.scss";

import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";

import AppRoutes from "../../../helpers/AppRoutes";
import DirectoriesList from "../../../components/DirectoriesList/DirectoriesList";
import RoloSearch from "../../../components/RoloSearch/RoloSearch";

export default function DirectoriesPage() {
	const [data, setData] = useState([]);

	const { directories = [] } = useSelector((state) => state.directories);

	useEffect(() => {
		setData(directories);
	}, [directories]);

	React.useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	return (
		<div className={s.root}>
			<Header title="Browse Directories" showBack/>

			<div className={s.content}>
				<DirectoriesList directories={data} />
			</div>

			<Footer
				page={AppRoutes.directories}
				search={<RoloSearch data={directories} setData={setData} />}
			/>
		</div>
	);
}
