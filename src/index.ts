import { googleDoodles } from "./googleDoodles.js";
import { smart_fetch } from "./utils.js";

const main = async (): Promise<void> => {
	/*for (let index = 0; index < 10; index++) {
		void smart_fetch("https://www.google.com");
	}*/
	smart_fetch("https://www.google.com");
	smart_fetch("https://www.bing.com");
	smart_fetch("https://www.google.com");
	smart_fetch("https://www.bing.com");
	smart_fetch("https://www.google.com");
	smart_fetch("https://www.bing.com");

	//debugger;
};

void main();
