import React, { useEffect, useState } from "react";
import cx from "classnames";
import { useHistory, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import { loadLatestShare, sendNewDataRequest } from "../../../../_redux/actions/contacts";
import { DISPLAY_FIELDS } from "../../../../helpers/AppHelper";

import s from "./RequestInfoPage.module.scss";

import AppRoutes from "../../../../helpers/AppRoutes";
import CheckboxWidget from "../../../../components/CheckboxWidget/CheckboxWidget";
import Header from "../../../../components/Header/Header";
import InfoCard from "../../../../components/InfoCard/InfoCard";
import RequestInfoDialog from "../../../../components/RequestInfoDialog/RequestInfoDialog";
import RoloButton from "../../../../components/RoloButton/RoloButton";
import TabsWidget from "../../../../components/TabsWidget/TabsWidget";

export default function RequestInfoPage() {
	const dispatch = useDispatch();
	const history = useHistory();
	const [showDialog, setShowDialog] = useState(false);
	const [selectedFields, setSelectedFields] = useState({});
	const [alreadyShared, setAlreadyShared] = useState([]);
	const [hasAll, setHasAll] = useState(false);

	const { id } = useParams() || {};

	const { CURRENT_DIRECTORY } = useSelector(state => state.directories);
	const profile = useSelector(state => state.user).user;
	const { CURRENT_CONTACT } = useSelector(state => state.contacts);

	let latestShare = useSelector(state => state.contacts.latestShare);
	let [enrichedContact, setEnrichedContact] = useState(CURRENT_CONTACT);

	useEffect(() => {
		dispatch(loadLatestShare(CURRENT_CONTACT.id, profile.id));
	}, []);

	useEffect(() => {
		if (!latestShare)
			return;

		for (var propertyName in CURRENT_CONTACT) {
			if (latestShare[propertyName]?.show === true || latestShare[propertyName]?.show === 'true') {
				CURRENT_CONTACT[propertyName] = latestShare[propertyName];
			}
		}
		setEnrichedContact(CURRENT_CONTACT);
	}, [latestShare])

	const displayFields = DISPLAY_FIELDS.filter((df) => df.key !== "directories");

	useEffect(() => {
		// Mark already shared fields
		if (profile) {
			let selected = {};
			let shared = [];
			displayFields.forEach(({ key }) => {
				if (enrichedContact[key] && (enrichedContact[key].show === 'true' || enrichedContact[key].show === true)) {
					shared.push(key);
					selected[key] = true;
				}
			});

			setSelectedFields(selected);
			setAlreadyShared(shared);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [profile, enrichedContact]);

	if (!profile) {
		history.push(AppRoutes.home);
		return null;
	}

	const name = enrichedContact?.nickname?.value;

	// ------------------------------------- METHODS -------------------------------------
	const requestInfo = () => {
		setShowDialog(true);

		const requestedFields = Object.keys(selectedFields).filter(
			(k) => !!selectedFields[k] && !alreadyShared.includes(k)
		);

		// Send Request Info
		dispatch(
			sendNewDataRequest({
				...profile,
				requestorId: profile.id,
				requesteeId: CURRENT_CONTACT.id,
				fields: requestedFields,
			})
		);
	};

	const toggleField = (name, selected) => {
		selectedFields[name] = selected;
		setSelectedFields({ ...selectedFields });
	};

	const toggleAll = () => {
		let selected = {};
		displayFields.forEach(({ key }) => {
			// Keep selection for already shared
			selected[key] = alreadyShared.includes(key) ? true : !hasAll;
		});

		setHasAll(!hasAll);
		setSelectedFields(selected);
	};

	const labelStyles = {
		cursor: "pointer",
		marginLeft: 8,
		userSelect: "none",
		fontFamily: "Poppins",
		fontSize: "14px",
		fontWeight: "400",
		color: "#FFF",
	};

	return (
		<div className={s.root}>
			<Header title="Exchange Information" showBack />

			<TabsWidget
				tabs={[
					{
						name: "Request Info",
						url: `${AppRoutes.exchangeInfo}/${id}`,
						isActive: true,
					},
					{
						name: "Share Info",
						url: `${AppRoutes.exchangeInfo}/${id}/share`,
					},
				]}
			/>

			{showDialog ? (
				<RequestInfoDialog
					contactId={id}
					directory={CURRENT_DIRECTORY}
					close={() => setShowDialog(false)}
				/>
			) : null}

			<div className={s.content}>
				<InfoCard
					title={`Connect with ${name}`}
					description={
						"You can request members share details with you that aren't visible to the whole directory. If they accept, you'll see a star next to their name and more details on their directory profile."
					}
				/>

				<div className={s.media}>
					<div className={s.section}>
						<div className={s.heading}>
							<div className={s.title}>Information Request:</div>
							<span className={s.buttonAll} onClick={toggleAll}>
								{hasAll ? "Clear All" : "Select All"}
							</span>
						</div>

						<div className={s.note}>Grey items are available in directory</div>
					</div>

					<div className={s.fields}>
						{displayFields.map(({ name, key }, index) => (
							<div className={s.field} key={index}>
								<CheckboxWidget
									checked={selectedFields[key]}
									disabled={alreadyShared.includes(key)}
									onChange={(val) => toggleField(key, val)}
									label={name}
									labelStyle={labelStyles}
								/>
							</div>
						))}
					</div>

					<div className={cx(s.section, s.buttons)}>
						<RoloButton text="Request Information" onClick={requestInfo} />
					</div>
				</div>
			</div>
		</div>
	);
}
