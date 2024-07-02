import axios from "axios";

import { sleep } from "./misc";

import { REQUEST_DELAY_MS, REQUEST_DELAY_WAIT_MULTIPLIER } from "@config";

const instance = axios.create();

// a mapping between domains and if they're ready for another request
const domains = new Map<string, boolean>();

// gets just the domain name of a url. "https://www.google.com/page" => "google"
export const getDomain = (url: string): string => {
	const hostname = new URL(url).hostname;
	const noEnding = hostname.slice(0, hostname.lastIndexOf("."));
	return noEnding.slice(noEnding.lastIndexOf(".") + 1);
};

const waitForNetwork = async (url: string): Promise<void> => {
	const domain = getDomain(url);

	// make sure the domain exists in the map
	if (!domains.has(domain)) domains.set(domain, true);

	while (!domains.get(domain))
		await sleep(REQUEST_DELAY_MS * REQUEST_DELAY_WAIT_MULTIPLIER);

	// set it to false and after DELAY_TIME ms, set it back to true
	domains.set(domain, false);
	setTimeout(() => {
		domains.set(domain, true);
	}, REQUEST_DELAY_MS);
};

instance.interceptors.request.use(async (config) => {
	const url = config.url ?? "";
	config.ctx.info(`Request started: ${url}`)
	await waitForNetwork(url);
	return config;
});
