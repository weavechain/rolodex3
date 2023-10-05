import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { ToastContainer } from "react-toastify";

import * as serviceWorker from "./serviceWorker";
import { Provider } from "react-redux";
//import axios from "axios";
//import config from "./config";

import App from "./App";

import store from "./_redux/store";

//axios.defaults.baseURL = config.baseURLApi;
//axios.defaults.headers.common["Content-Type"] = "application/json";

ReactDOM.render(
	<Provider store={store}>
		<ToastContainer
			autoClose={3000}
			position="bottom-right"
			hideProgressBar={false}
			newestOnTop={false}
			closeOnClick
			pauseOnFocusLoss
			draggable
		/>
		<Suspense fallback={<div>Loading...</div>}>
			<App />
		</Suspense>
	</Provider>,
	document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
