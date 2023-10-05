import DEFAULT_DEMO_DATA from "../_mocks/DEFAULT_DEMO_DATA";

const getUserByToken = () => {
	return DEFAULT_DEMO_DATA.profile;
};

const BlockchainHelper = {
	getUserByToken,
};

export default BlockchainHelper;
