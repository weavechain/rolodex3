import React from "react";
import { Switch, Route } from "react-router";

import AppRoutes from "../../helpers/AppRoutes";
import ContactProfilePage from "./ContactProfilePage/ContactProfilePage";
import ContactsPage from "./ContactsPage";
import ContactsReceivedPage from "./ContactsReceivedPage/ContactsReceivedPage";
import ContactsRequestsPage from "./ContactsRequestsPage/ContactsRequestsPage";
import ContactsSentPage from "./ContactsSentPage/ContactsSentPage";
import RespondIndex from "./RespondToRequest";
import ExchangeInfo from "./exchange";

export default function ContactsIndex() {
	return (
		<Switch>
			<Route
				path={AppRoutes.contactsRequests}
				component={ContactsRequestsPage}
			/>

			<Route
				path={AppRoutes.contactsRequests}
				component={ContactsRequestsPage}
			/>

			<Route
				path={AppRoutes.contactsReceived}
				component={ContactsReceivedPage}
			/>

			<Route path={AppRoutes.contactsRespond} component={RespondIndex} />

			<Route path={AppRoutes.exchangeInfo} component={ExchangeInfo} />

			<Route path={AppRoutes.contactsSent} component={ContactsSentPage} />

			<Route path={AppRoutes.contactDetails} component={ContactProfilePage} />

			<Route path={AppRoutes.contacts} component={ContactsPage} />
		</Switch>
	);
}
