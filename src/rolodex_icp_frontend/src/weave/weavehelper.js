import WeaveAPI from "../weaveapi/weaveapi";
import Helper from "../weaveapi/helper";

import LOCAL_STORAGE from "../helpers/localStorage";

//TODO: !!! < daily token refresh

export const getConfig = (sideChain) => {
	if (!sideChain || (Object.keys(sideChain).length === 0 && Object.getPrototypeOf(sideChain) === Object.prototype)) return null;

	const idx = sideChain.indexOf("://");
	if (idx < 0) return null;
	const lidx = sideChain.lastIndexOf("/");

	const protocol = sideChain.substring(0, idx);
	const idxp = sideChain.lastIndexOf(":");
	const host = sideChain.substring(idx + 3, idxp);
	const port = sideChain.substring(idxp + 1, lidx);
	const seed = sideChain.substring(lidx + 1);

	const appState = LOCAL_STORAGE.loadState();

	const cfg = {
		apiVersion: 1,

		seed: seed,
		privateKey: appState.pvk,
		publicKey: appState.pub,
		encrypted: protocol === "http",
	};

	if (protocol === "http" || protocol === "https") {
		cfg["http"] = {
			host: host,
			port: port,
			useHttps: protocol === "https",
		};
	} else if (protocol === "ws" || protocol === "wss") {
		cfg["websocket"] = {
			host: host,
			port: port,
			useWss: protocol === "wss",
		};
	}

	//console.log(cfg)
	return cfg;
};

export const getNodeApi = async (sideChain) => {
	const nodeApi = new WeaveAPI().create(getConfig(sideChain));
	if (nodeApi == null) return null;

	await nodeApi.init();
	const pong = await nodeApi.ping();
	console.log(pong);
	return nodeApi;
};

export const getSession = async (nodeApi) => {
	//TODO: need to login without org, just for monitoring
	const organization = "*";
	const account = nodeApi.publicKey;
	const scope = "*";
	return await nodeApi.login(organization, account, scope);
};

export const weaveLogin = async (sideChain) => {
	try {
		const nodeApi = await getNodeApi(sideChain);
		if (nodeApi == null) return null;

		const session = await getSession(nodeApi);
		//return nodeApi.getSidechainInfo(); //TODO: !!!
		return [nodeApi, session];
	} catch (e) {
		console.log(e);
		return null;
	}
};

export const weaveFetchSidechainDetails = async (sideChain) => {
	try {
		const nodeApi = await getNodeApi(sideChain);
		if (nodeApi == null) return [];

		const session = await getSession(nodeApi);
		return nodeApi.getSidechainDetails(session);
	} catch (e) {
		console.log(e);
		return [];
	}
};

export const weaveFetchUserDetails = async (sideChain, user) => {
	try {
		const nodeApi = await getNodeApi(sideChain);
		if (nodeApi == null) return [];

		const session = await getSession(nodeApi);
		return nodeApi.getUserDetails(session, user);
	} catch (e) {
		console.log(e);
		return [];
	}
};

export const weaveFetchNodes = async (sideChain) => {
	try {
		const nodeApi = await getNodeApi(sideChain);
		if (nodeApi == null) return [];

		const session = await getSession(nodeApi);
		return nodeApi.getNodes(session);
	} catch (e) {
		console.log(e);
		return [];
	}
};

export const weaveFetchScopes = async (sideChain) => {
	try {
		const nodeApi = await getNodeApi(sideChain);
		if (nodeApi == null) return [];

		const session = await getSession(nodeApi);
		return nodeApi.getScopes(session);
	} catch (e) {
		console.log(e);
		return [];
	}
};

export const weaveFetchTables = async (sideChain, scope) => {
	try {
		const nodeApi = await getNodeApi(sideChain);
		if (nodeApi == null) return [];

		const session = await getSession(nodeApi);
		//console.log(session);
		return nodeApi.getTables(session, scope);
	} catch (e) {
		console.log(e);
		return [];
	}
};

export const weaveUpdateConfig = async (sideChain, path, scope) => {
	try {
		const nodeApi = await getNodeApi(sideChain);
		if (nodeApi == null) return [];

		const session = await getSession(nodeApi);
		//console.log(session);
		return nodeApi.updateConfig(session, path, scope);
	} catch (e) {
		console.log(e);
		return [];
	}
};

export const weaveCreateAccount = async (sideChain, path, account) => {
	try {
		const nodeApi = await getNodeApi(sideChain);
		if (nodeApi == null) return [];

		const session = await getSession(nodeApi);
		return nodeApi.createAccount(session, path, account);
	} catch (e) {
		console.log(e);
		return [];
	}
};

export const weaveUpdateFee = async (sidechain, path, scope, fee) => {
	try {
		const nodeApi = await getNodeApi(sidechain);
		if (nodeApi == null) return [];

		const session = await getSession(nodeApi);
		return nodeApi.updateFee(session, path, scope, fee);
	} catch (e) {
		console.log(e);
		return [];
	}
};

const WeaveHelper = {
	weaveLogin,
	weaveFetchSidechainDetails,
	weaveFetchUserDetails,
	weaveFetchNodes,
	weaveFetchScopes,
	weaveFetchTables,
	weaveUpdateConfig,
	weaveCreateAccount,
	weaveUpdateFee,
	Helper
};

export default WeaveHelper;
