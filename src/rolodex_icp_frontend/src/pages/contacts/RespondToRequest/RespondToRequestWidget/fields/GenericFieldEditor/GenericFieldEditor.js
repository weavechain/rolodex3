import React from "react";
import cx from "classnames";

import s from "./GenericFieldEditor.module.scss";

import { getProfileInfo } from "../../../../../../helpers/Utils";

import InputWidget from "../../../../../../components/InputWidget/InputWidget";
import ToggleWidget from "../../../../../../components/ToggleWidget/ToggleWidget";
import GenericDisplayText from "./GenericDisplayText";
import AvatarWidget from "../../../../../../components/AvatarWidget/AvatarWidget";
import SushiSelector from "../../../../../../components/selectors/SushiSelector/SushiSelector";

export default function GenericFieldEditor({
	profile,
	name,
	title,
	placeholder = "ex. jim",
	requestedFields = [],
	updateModel = () => {},
	updateVisibility = () => {},
}) {
	const value = getProfileInfo(profile, name) || "";
	const show = profile[name]?.show;
	const isRequested = requestedFields.includes(name);
	const isEditMode = isRequested && !value;

	return (
		<div className={s.root}>
			<div className={s.section}>
				<div className={s.sectionHeader}>
					<div
						className={cx(s.title, {
							[s.requested]: isRequested,
						})}
					>
						{title || name}
					</div>

					<ToggleWidget
						isVisible={!!show}
						onToggle={(val) => updateVisibility(name, val)}
					/>
				</div>

				{name === "avatar" ? (
					<AvatarWidget avatar={getProfileInfo(profile, "avatar")} />
				) : isEditMode ? (
					name === "favorite_sushi" ? (
						<SushiSelector
							value={value}
							noTitle
							onSelect={(value) => updateModel(name, value)}
						/>
					) : (
						<InputWidget
							isMandatory
							value={value}
							placeholder={placeholder}
							onChange={(newVal) => updateModel(name, newVal)}
							titleClass={s.sectionTitle}
						/>
					)
				) : (
					<GenericDisplayText text={value} name={name} show={show} />
				)}
			</div>
		</div>
	);
}
