import React from "react";
import { Switch, Route } from "react-router";

import AppRoutes from "../../../helpers/AppRoutes";
import RespondViewProfile from "./RespondViewProfile/RespondViewProfile";
import RespondToRequestInfo from "./RespondToRequestInfo/RespondToRequestInfo";

export default function RespondIndex() {
	return (
		<Switch>
			<Route
				path={`${AppRoutes.contactsRespond}/profile`}
				exact
				component={RespondViewProfile}
			/>

			<Route
				exact
				path={AppRoutes.contactsRespond}
				component={RespondToRequestInfo}
			/>
		</Switch>
	);
}
