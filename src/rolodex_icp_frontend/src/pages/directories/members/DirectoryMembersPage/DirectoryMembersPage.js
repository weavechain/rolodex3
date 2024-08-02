import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";

import { loadMembersOfDirectory, setCurrentContact } from "../../../../_redux/actions/contacts";

import s from "./DirectoryMembersPage.module.scss";

import Header from "../../../../components/Header/Header";
import AppRoutes from "../../../../helpers/AppRoutes";
import TabsWidget from "../../../../components/TabsWidget/TabsWidget";
import SortingWidget from "../../../../components/SortingWidget/SortingWidget";
import FavoriteIcon from "../../../../components/icons/FavoriteIcon";
import Footer from "../../../../components/Footer/Footer";
import RoloSearch from "../../../../components/RoloSearch/RoloSearch";
import { setUserProfileForDirectory } from "../../../../_redux/actions/directories";
import { assureDirectoryProfileIsUiFormat } from "../../../../_redux/reducers/user";
import { getListNameForAccount } from "../../../../helpers/Utils";

export default function DirectoryMembersPage() {
	const dispatch = useDispatch();
	const history = useHistory();

	const { id } = useParams() || {};
	const [members, setMembers] = useState([]);

	const { directories = [] } = useSelector((state) => state.directories);
	const directory = directories.find((d) => d.directoryId === id);

	const userId = useSelector(state => state.user.user);
	const [hasJoined, setHasJoined] = useState(false);

	useEffect(() => {
		dispatch(setUserProfileForDirectory(userId, id))
			.then(r => setHasJoined(r ? true : false));
	}, []);

	useEffect(() => {
		// TODO: load members from DB based on directory id
		loadMembersOfDirectory(id)
			.then(m => m.map(x => assureDirectoryProfileIsUiFormat(x)))
			.then(m => setMembers(m));
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
				`${AppRoutes.directories}/${directory.directoryId}/members/${member.userId}`
			);
		});
	};

	return (
		<div className={s.root}>
			<Header title="Directory Members" showBack />

			{hasJoined ? (
				<TabsWidget
					tabs={[
						{ name: "About", url: `${AppRoutes.directories}/${directory.directoryId}` },
						{ name: "Members", isActive: true },
						{
							name: "My Dir. Profile",
							url: `${AppRoutes.directories}/${directory.directoryId}/profile`,
						},
					]}
				/>
			) : null}

			<div className={s.content}>
				<SortingWidget
					showContacts
					onUpdate={setMembers}
					members={members}
				/>

				<div className={s.members}>
					{members.map((m, index) => (
						<div
							onClick={() => viewMemberDetails(m)}
							key={index}
							className={s.row}
						>
							<div className={s.info}>
								<div className={s.name}>{getListNameForAccount(m)}</div>
								<div className={s.dateCreated}>
									Member since {new Date(Number(m.ts)).toISOString().split('T')[0]}
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
