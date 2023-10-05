import React from "react";
import { Switch, Route } from "react-router";

import AppRoutes from "../../helpers/AppRoutes";
import DirectoriesPage from "./DirectoriesPage/DirectoriesPage";
import DirectoryDetailsPage from "./DirectoryDetailsPage/DirectoryDetailsPage";
import DirectoryMembersPage from "./members/DirectoryMembersPage/DirectoryMembersPage";
import DirectoryProfilePage from "./DirectoryProfilePage/DirectoryProfilePage";
import MyDirectoriesPage from "./MyDirectoriesPage/MyDirectoriesPage";
import EditDirectoryProfilePage from "./EditDirectoryProfilePage/EditDirectoryProfile";
import DirectoryMemberDetails from "./members/DirectoryMemberDetails/DirectoryMemberDetails";

export default function DirectoryIndex() {
	return (
		<Switch>
			<Route
				path={AppRoutes.directoryMemberDetails}
				component={DirectoryMemberDetails}
				exact
			/>

			<Route
				path={AppRoutes.myDirectories}
				exact
				component={MyDirectoriesPage}
			/>

			<Route
				path={AppRoutes.directoryProfile}
				component={DirectoryProfilePage}
				exact
			/>

			<Route
				path={AppRoutes.directoryMembers}
				component={DirectoryMembersPage}
				exact
			/>
			<Route
				path={AppRoutes.directoryDetails}
				component={DirectoryDetailsPage}
				exact
			/>

			<Route
				path={AppRoutes.directoryEditProfile}
				component={EditDirectoryProfilePage}
				exact
			/>

			<Route path={AppRoutes.directories} component={DirectoriesPage} />
		</Switch>
	);
}
