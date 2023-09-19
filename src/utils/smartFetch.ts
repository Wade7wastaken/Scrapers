import { inspect } from "node:util";

import type { AxiosError, AxiosRequestConfig } from "axios";
import axios, { isAxiosError } from "axios";

import { DELAY_TIME, NO_RETRY_HTTP_CODES } from "../config.js";

import type { Logger } from "./logger.js";
import { capitalize, sleep } from "./misc.js";

const domains = new Map();

const getDomain = (url: string): string => {
	const hostname = new URL(url).hostname;
	const noEnding = hostname.slice(0, hostname.lastIndexOf("."));
	return noEnding.slice(noEnding.lastIndexOf(".") + 1);
};

const getRetryMS = (retry: number): number => 2 ** (retry + 1) * 1000;

const fetchWrapper = async <T>(
	log: Logger,
	url: string,
	options: AxiosRequestConfig,
	retry = 0
): Promise<T | undefined> => {
	const requestName = `request to ${url} with options ${inspect(options)}`;

	if (retry >= 5) {
		log.error(`${capitalize(requestName)} failed after ${retry} attempts.`);
		return undefined;
	}

	try {
		const response = await axios.get<T>(url, options);
		return response.data;
	} catch (error) {
		if (!isAxiosError(error)) throw error;
		error as AxiosError;

		const retryDelay = getRetryMS(retry);

		if (error.response) {
			if (NO_RETRY_HTTP_CODES.includes(error.response.status)) {
				log.error(
					`Unretriable HTTP code returned on request to ${requestName}: ${error.response.status}`
				);
				return undefined;
			} else {
				log.warn(
					`Retriable error on request to ${requestName}. Retrying in ${retryDelay}ms. Error details:`
				);
				log.warn(error);

				await sleep(retryDelay);

				return fetchWrapper(log, url, options, retry + 1);
			}
		} else if (error.request) {
			log.warn(
				`No response received on request to ${requestName}. Retrying in ${retryDelay}ms. Error details:`
			);
			log.warn(error);

			await sleep(retryDelay);

			return fetchWrapper(log, url, options, retry + 1);
		}
	}
};

export async function smartFetch<T>(
	log: Logger,
	url: string,
	params?: Record<string, string | number>,
	silent = false
): Promise<T | undefined> {
	const domain = getDomain(url);

	if (!domains.has(domain)) {
		domains.set(domain, true);
	}

	while (!domains.get(domain)) {
		await sleep(DELAY_TIME / 2);
	}

	domains.set(domain, false);
	setTimeout(() => {
		domains.set(domain, true);
	}, DELAY_TIME);

	log.info(`Request started: ${url}`);

	const response = await fetchWrapper<T>(log, url, { params });

	if (!silent && response === undefined) log.warn(`Request to ${url} failed`);

	return response;
}
