import axios from "axios";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const requestTimings = {
	"www.google.com": 0,
};

const DELAY_TIME = 1000;
const MAX_ATTEMPTS = 5;

export const smart_fetch = async (url, iter = 0) => {
	const domainName = new URL(url).hostname;

	const timings = requestTimings[domainName];

	// if it exists and it's been more than 0.5 seconds
	if (timings !== undefined && Date.now() - timings <= DELAY_TIME) {
		await new Promise((r) => setTimeout(r, DELAY_TIME));
	}

	requestTimings[domainName] = Date.now();

	console.log(`Request to ${url}`);

	let res;

	try {
		res = await axios.get(url);
	} catch (error) {
		if (error.response.status !== 404) {
			console.log(`NON-404: ${url} returned ${error}`);
			await new Promise((r) => setTimeout(r, 1000 * iter)); // wait iter second
			if (iter >= MAX_ATTEMPTS) {
				console.log(`Fetching ${url} failed after ${iter} attempts.`);
				throw error;
			}
			return await smart_get(url, iter + 1); // call this function again and increase the iteration
		}
		console.log(`${url} returned ${error}`);
		throw error;
	}
	return res;
};

const domains = new Map();

export async function fetch3(url) {
	if (!domains.has(url)) {
		domains.set(url, Date.now());
	} else {
		const now = Date.now();
		domains.set(url, now);
		const timeSinceLastRequest = now - domains.get(url);
		await sleep(Math.max(0, 1000 - timeSinceLastRequest));
	}
	console.log(`request started: ${url}`);
	const response = await fetch(url);
	const text = await response.text();
	return text;
}
