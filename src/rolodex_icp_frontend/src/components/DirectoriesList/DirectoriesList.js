import React from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

import { hasItems } from "../../helpers/Utils";
import { setCurrentDirectory } from "../../_redux/actions/directories";

import s from "./DirectoriesList.module.scss";

import ArrowRightIcon from "../../components/icons/ArrowRightIcon";
import EmptyImage from "../../assets/images/general/empty-directories.svg";
import RoloButton from "../RoloButton/RoloButton";
import AppRoutes from "../../helpers/AppRoutes";

export default function DirectoriesList({ directories = [] }) {
	const dispatch = useDispatch();
	const history = useHistory();
	// ------------------------------------- METHODS -------------------------------------
	const goToDirectories = () => {
		history.push(AppRoutes.directories);
	};

	const viewDetails = (directory) => {
		dispatch(setCurrentDirectory(directory)).then(() => {
			history.push(`${AppRoutes.directories}/${directory.directoryId}`);
		});
	};

	return (
		<div className={s.root}>
			{hasItems(directories) ? (
				<>
					{directories.map((d, index) => (
						<div
							key={index}
							className={s.directory}
							onClick={() => viewDetails(d)}
						>
							<div className={s.info}>
								<div className={s.name}>{d.name}</div>
								<div className={s.description}>{d.description}</div>
							</div>
							<ArrowRightIcon />
						</div>
					))}
				</>
			) : (
				<div className={s.empty}>
					<div className={s.card}>
						<div className={s.title}>Nothing to see here!</div>
						<div className={s.description}>
							Join some directories to see them on this page
						</div>
					</div>

					<img src={EmptyImage} alt="..." />

					<RoloButton
						text="Browse & Join Directories"
						className={s.button}
						onClick={goToDirectories}
						noIcon
					/>
				</div>
			)}
		</div>
	);
}
