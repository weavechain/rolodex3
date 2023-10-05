import { uniqueId } from "lodash";

import WevDirIcon from "../assets/images/directories/Wev.svg";
import DeSciSFDirIcon from "../assets/images/directories/DeSciSF.svg";
import EthParisDirIcon from "../assets/images/directories/EthParis.svg";

//import profile from "./profile";
import members from "./members";

const lookingFor = [
	{ name: "Networking", value: 48.8 },
	{ name: "Investors", value: 14.6 },
	{ name: "Other", value: 12.3 },
	{ name: "Collaborators", value: 24.3 },
];

const directories = [
	{
		id: uniqueId(),
		name: "WEV Global",
		description:
			"The first self-sovereign networking tool. Connect with others who value data ownership and privacy. This is the core directory for RoloDEX.",
		established_date: "July 2023",
		icon: WevDirIcon,
		members,
		average_age: 32,
		favorite_sushi: "salmon",
		lookingForAgg: lookingFor,
		//profile,
		isCoreDirectory: true,
	},
	{
		id: uniqueId(),
		name: "EthGlobal Paris 2023",
		description: "Connect with EthGlobal Paris 2023 attendees!",
		established_date: "July 2023",
		icon: EthParisDirIcon,
		members,
		average_age: 32,
		favorite_sushi: "tuna",
		lookingForAgg: lookingFor,
	},
	{
		id: uniqueId(),
		name: "DeSci Global",
		description: "Connect with DeSci Global attendees!",
		established_date: "Nov 2022",
		icon: DeSciSFDirIcon,
		members,
		average_age: 32,
		favorite_sushi: "salmon",
		lookingForAgg: lookingFor,
	},
	{
		id: uniqueId(),
		name: "DeSci Local",
		description: "Connect with DeSci Local attendees!",
		established_date: "Nov 2022",
		icon: DeSciSFDirIcon,
		members,
		average_age: 32,
		favorite_sushi: "salmon",
		lookingForAgg: lookingFor,
	},
	{
		id: uniqueId(),
		name: "New Directory",
		description: "Connect with New Directory attendees!",
		established_date: "Nov 2022",
		icon: DeSciSFDirIcon,
		members,
		average_age: 32,
		favorite_sushi: "salmon",
		lookingForAgg: lookingFor,
	},
];

export default directories;
