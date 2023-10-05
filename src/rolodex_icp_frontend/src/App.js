import React from "react";
import { HashRouter } from "react-router-dom";
import { MetaMaskProvider } from "metamask-react";

import "./assets/styles/theme.scss";
import RoloDexApp from "./pages/RoloDexApp";
class App extends React.PureComponent {
	render() {
		return (
			<HashRouter>
				<MetaMaskProvider>
					<RoloDexApp />
				</MetaMaskProvider>
			</HashRouter>
		);
	}
}

export default App;
