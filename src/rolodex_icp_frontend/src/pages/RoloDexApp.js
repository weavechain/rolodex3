import React, { useState, useEffect } from "react";
import { Container } from "reactstrap";

import Web3 from "web3";
import { Switch, Route, Redirect } from "react-router";
import { useMetaMask } from "metamask-react";
import { useDispatch, useSelector } from "react-redux";

// ACTIONS
import { initDirectories } from "../_redux/actions/directories";

import s from "./RoloDexApp.module.scss";

import AppRoutes from "../helpers/AppRoutes";
import HomePage from "./home/HomePage";
import LoginPage from "./login/LoginPage/LoginPage";
import WelcomePage from "./WelcomePage/WelcomePage";
import MetamaskWaitingPage from "./MetamaskWaitingPage/MetamaskWaitingPage";
import ProfileIndex from "./profile/ProfileIndex";
import DirectoryIndex from "./directories/DirectoryIndex";
import ContactsIndex from "./contacts/ContactsIndex";

export default function RoloDexApp() {
	const [user, setUser] = useState(null);
	const meta = useMetaMask();
	const dispatch = useDispatch();

	const reduxUser = useSelector(state => state.user);

	const isLoggedIn = !!meta.account || reduxUser.user;

	useEffect(() => {
		dispatch(initDirectories());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		const wallet =
			meta.account && meta.account.length > 0
				? Web3.utils.toChecksumAddress(meta.account)
				: null;

		if (meta?.status === "connected") {
			setUser({
				metamaskAccount: wallet,
				avatar: "metamask",
			});
		} else if (meta?.status === "initializing") {
			setUser(null);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [meta.account]);

	// ------------------------------------- METHODS -------------------------------------
	const PrivateRoute = ({ isLoggedIn, ...props }) => {
		return isLoggedIn ? (
			<Route {...props} />
		) : (
			<Redirect to={AppRoutes.welcome} />
		);
	};

	return (
		<Container fluid className={s.root}>
			<Switch>
				<Route path={AppRoutes.loginWithToken} component={LoginPage} />
				<Route path={AppRoutes.profile} component={ProfileIndex} />
				<Route path={AppRoutes.metamask} component={MetamaskWaitingPage} />

				<Route
					path={[AppRoutes.directories, AppRoutes.myDirectories]}
					render={() => <DirectoryIndex user={user} />}
				/>

				<Route
					path={[AppRoutes.contacts]}
					render={() => <ContactsIndex user={user} />}
				/>

				<Route exact path={AppRoutes.welcome} component={WelcomePage} />

				<PrivateRoute
					isLoggedIn={isLoggedIn}
					hasProfile={true}
					path={AppRoutes.home}
					render={() => <HomePage user={user} />}
				/>
			</Switch>
		</Container>
	);
}
