import axios, { AxiosResponse } from "axios";

const sleep = (ms: number): Promise<void> =>
	new Promise((r) => setTimeout(r, ms));

const DELAY_TIME = 1000;

const domains = new Map();

export async function smart_fetch<wanted>(
	url: string
): Promise<wanted | undefined> {
	const now = Date.now();
	if (domains.has(url)) {
		//console.log("old domain");

		const timeSinceLastRequest = now - domains.get(url);
		domains.set(url, now);

		const sleepTime = Math.max(0, DELAY_TIME - timeSinceLastRequest);

		console.log(`sleeping ${sleepTime} ms`);

		await sleep(sleepTime);
	} else {
		//console.log("new domain");
		domains.set(url, now);
	}
	console.log(`request started: ${url}`);

	let response: AxiosResponse<wanted>;

	try {
		// im not quite sure what the type parameters mean here, but .data should give me a string so...
		response = await axios.get<wanted>(url);
	} catch (error) {
		console.error("FETAL ERROR IN GET:");
		console.error(error);
		return undefined;
	}

	return response.data;
}
