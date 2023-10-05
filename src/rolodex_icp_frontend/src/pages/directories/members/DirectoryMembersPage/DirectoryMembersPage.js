import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";

import { setCurrentContact } from "../../../../_redux/actions/contacts";

import s from "./DirectoryMembersPage.module.scss";

import Header from "../../../../components/Header/Header";
import AppRoutes from "../../../../helpers/AppRoutes";
import TabsWidget from "../../../../components/TabsWidget/TabsWidget";
import SortingWidget from "../../../../components/SortingWidget/SortingWidget";
import FavoriteIcon from "../../../../components/icons/FavoriteIcon";
import Footer from "../../../../components/Footer/Footer";
import RoloSearch from "../../../../components/RoloSearch/RoloSearch";

export default function DirectoryMembersPage() {
	const dispatch = useDispatch();
	const history = useHistory();

	const { id } = useParams() || {};
	const [members, setMembers] = useState([]);

	const { directories = [] } = useSelector((state) => state.directories);
	const directory = directories.find((d) => d.id === id);
	const profile = directory?.profile;
	const hasJoined = !!profile;
	const allMembers = directory?.members || [];

	useEffect(() => {
		setMembers(directory?.members || []);
	}, [directory]);

	// ------------------------------------- METHODS -------------------------------------
	const viewMemberDetails = (member) => {
		console.debug(member);

		dispatch(
			setCurrentContact({
				...member,
				seen: true,
			})
		).then(() => {
			history.push(
				`${AppRoutes.directories}/${directory.id}/members/${member.id}`
			);
		});
	};

	return (
		<div className={s.root}>
			<Header title="Directory Members" showBack />

			{hasJoined ? (
				<TabsWidget
					tabs={[
						{ name: "About", url: `${AppRoutes.directories}/${directory.id}` },
						{ name: "Members", isActive: true },
						{
							name: "My Dir. Profile",
							url: `${AppRoutes.directories}/${directory.id}/profile`,
						},
					]}
				/>
			) : null}

			<div className={s.content}>
				<SortingWidget
					showContacts
					onUpdate={setMembers}
					members={allMembers}
				/>

				<div className={s.members}>
					{members.map((m, index) => (
						<div
							onClick={() => viewMemberDetails(m)}
							key={index}
							className={s.row}
						>
							<div className={s.info}>
								<div className={s.name}>{m.name.displayText}</div>
								<div className={s.dateCreated}>
									Member since {m.date_created}
								</div>
							</div>

							{m.isContact ? (
								<div className={s.contact}>
									<FavoriteIcon />
								</div>
							) : null}
						</div>
					))}
				</div>
			</div>

			<Footer
				page={AppRoutes.directories}
				search={
					<RoloSearch data={directory?.members || []} setData={setMembers} />
				}
			/>
		</div>
	);
}
