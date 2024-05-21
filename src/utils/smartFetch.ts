import { inspect } from "node:util";

import { Err, Ok } from "@thames/monads";
import axios, { isAxiosError } from "axios";

import { capitalize, sleep } from "./misc";

import type { Logger } from "./logger";
import type { Result } from "@thames/monads";
import type { AxiosRequestConfig } from "axios";
import type { ZodSchema, z } from "zod";

import {
	MAX_RETRIES,
	NO_RETRY_HTTP_CODES,
	REQUEST_DELAY_MS,
	REQUEST_DELAY_WAIT_MULTIPLIER,
} from "@config";

// a mapping between domains and if they're ready for another request
const domains = new Map<string, boolean>();

// gets just the domain name of a url. "https://www.google.com/page" => "google"
export const getDomain = (url: string): string => {
	const hostname = new URL(url).hostname;
	const noEnding = hostname.slice(0, hostname.lastIndexOf("."));
	return noEnding.slice(noEnding.lastIndexOf(".") + 1);
};

// how long to wait given how many retries there have been
const getRetryMS = (retries: number): number => 2 ** (retries + 1) * 1000;

// waits until there has been at least REQUEST_DELAY_MS milliseconds between the
// last request to the same domain name
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

// a wrapper of the main fetch function to allow for retries
const fetchWrapper = async <T extends ZodSchema>(
	log: Logger,
	url: string,
	options: AxiosRequestConfig,
	expectedType: T,
	retry = 0
): Promise<Result<z.infer<T>, string>> => {
	const requestName = `request to ${url} with options ${inspect(options)}`;

	if (retry >= MAX_RETRIES)
		return Err(
			`${capitalize(requestName)} failed after ${retry} attempts.`
		);

	try {
		const response = await axios.get<unknown>(url, options);
		return Ok(expectedType.parse(response.data));
	} catch (error) {
		if (!isAxiosError(error)) throw error;

		const retryDelay = getRetryMS(retry);

		// PR if you can clean up this error handling pls
		if (
			error.response &&
			NO_RETRY_HTTP_CODES.includes(error.response.status)
		)
			return Err(
				`Unretriable HTTP code returned on request to ${requestName}: ${error.response.status}`
			);

		log.warn(
			`Retriable error on request to ${requestName}. Retrying in ${retryDelay}ms. Error details:`
		);
		log.warn(error);

		await sleep(retryDelay);

		return fetchWrapper(log, url, options, expectedType, retry + 1);
	}
};

export const smartFetch = async <T extends ZodSchema>(
	log: Logger,
	url: string,
	expectedType: T,
	params?: Record<string, string | number>,
	silent = false
): Promise<Result<z.infer<T>, string>> => {
	await waitForNetwork(url);

	log.info(`Request started: ${url}`);

	const response = await fetchWrapper<T>(log, url, { params }, expectedType);

	// use silent if you want to make your own error message
	if (!silent && response.isErr()) log.warn(`Request to ${url} failed`);
	else log.info(`Request to ${url} succeeded`);

	return response;
};

export const exists = async (log: Logger, url: string): Promise<boolean> => {
	await waitForNetwork(url);

	try {
		const response = await axios.head(url);
		// Check if the status code is in the 200-399 range, indicating a successful request.
		const doesExist = response.status >= 200 && response.status < 400;

		if (doesExist) log.info(`${url} exists: returned ${response.status}`);
		else log.warn(`${url} doesn't exist: returned ${response.status}`);

		return doesExist;
	} catch (error) {
		if (!isAxiosError(error)) throw error;

		// Axios will throw an error for non-2xx status codes.
		log.error(`Axios error when checking if ${url} exists. Error details:`);
		log.error(error);
		return false;
	}
};
