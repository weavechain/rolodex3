import React from "react";
import { Switch, Route } from "react-router";

import AppRoutes from "../../helpers/AppRoutes";
import CoreProfilePage from "./CoreProfilePage/CoreProfilePage";
import ProfileInfoPage from "./ProfileInfoPage/ProfileInfoPage";
import ProfilePage from "./ProfilePage/ProfilePage";

export default function ProfileIndex() {
	return (
		<Switch>
			<Route path={AppRoutes.profileInfo} exact component={ProfileInfoPage} />
			<Route path={AppRoutes.coreProfile} exact component={CoreProfilePage} />
			<Route path={AppRoutes.profile} component={ProfilePage} />
		</Switch>
	);
}
