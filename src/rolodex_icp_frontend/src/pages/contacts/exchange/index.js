import React from "react";
import { Switch, Route } from "react-router";

import AppRoutes from "../../../helpers/AppRoutes";
import ShareInfoPage from "./ShareInfoPage.js/ShareInfoPage";
import RequestInfoPage from "./RequestInfoPage/RequestInfoPage";

export default function ExchangeInfo() {
	return (
		<Switch>
			<Route
				exact
				path={`${AppRoutes.exchangeInfo}/:id/share`}
				component={ShareInfoPage}
			/>
			<Route
				path={`${AppRoutes.exchangeInfo}/:id`}
				component={RequestInfoPage}
			/>
		</Switch>
	);
}
