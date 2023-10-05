export const loadState = () => {
	try {
		const serialState = localStorage.getItem("appState");
		if (serialState === null) return {};

		return JSON.parse(serialState);
	} catch (err) {
		return {};
	}
};

export const saveState = (state) => {
	try {
		const serialState = JSON.stringify(state);
		localStorage.setItem("appState", serialState);
		return true;
	} catch (err) {
		console.log(err);
		return false;
	}
};


const LOCAL_STORAGE = {
	saveState,
	loadState,
};

export default LOCAL_STORAGE;

