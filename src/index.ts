import { googleSite } from "./googleSite.js";

const main = async (): Promise<void> => {
	console.log(await googleSite());

	debugger;
};

void main();
