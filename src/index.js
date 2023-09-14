import { googleDoodles } from "./googleDoodles.js";
import { fetch3, fetchDataWithDelay, smart_fetch } from "./utils.js";

const main = async () => {
	//console.log(await googleDoodles());

	const promises = [
		fetch3("https://www.google.com"),
		fetch3("https://www.google.com"),
		fetch3("https://www.bing.com"),
	];

	const results = await Promise.all(promises);
	console.log(results);

	//debugger;
};

main();
