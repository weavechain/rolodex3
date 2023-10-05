import { combineReducers } from "redux";
import user from "./user";
import directories from "./directories";
import contacts from "./contacts";

export default combineReducers({
	user,
	directories,
	contacts,
});
