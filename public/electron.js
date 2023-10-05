const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const isDev = require("electron-is-dev");

let mainWindow;

const createWindow = () => {
	mainWindow = new BrowserWindow({ width: 1280, height: 800, zoomFactor: 1 });
	mainWindow.loadURL(
		isDev
			? "http://localhost:3000"
			: `file://${path.join(__dirname, "../build/index.html")}`
	);
	mainWindow.on("closed", () => (mainWindow = null));

	// Open External Web Pages
	mainWindow.webContents.setWindowOpenHandler(({ url }) => {
		require("electron").shell.openExternal(url);
		return { action: "deny" };
	});
};

app.on("ready", createWindow);

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	if (mainWindow === null) {
		createWindow();
	}
});
