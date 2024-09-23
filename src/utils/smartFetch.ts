import axios, { isAxiosError, type AxiosRequestConfig } from "axios";
import axiosRetry, { isNetworkOrIdempotentRequestError } from "axios-retry";
import { ResultAsync, err, ok } from "neverthrow";

import { capitalize, sleep, smartInspect } from "./misc";

import type { Context } from "./context";
import type { Result } from "neverthrow";
import type { ZodSchema, z } from "zod";

import {
	MAX_RETRIES,
	REQUEST_DELAY_MS,
	REQUEST_DELAY_WAIT_MULTIPLIER,
} from "@config";

// how long to wait given how many retries there have been
export const getRetryMS = (retries: number): number =>
	2 ** (retries + 1) * 1000;

// formats a config into a string used for errors and warnings
// might not be a bad idea to memo this because smartInspect can be expensive
const formatRequestInfo = (config: AxiosRequestConfig): string =>
	`request to ${config.url}${config.params ? ` with params ${smartInspect(config.params)}` : ""}`;

// create an axios instance
const instance = axios.create();

// config for 3rd party axios-retry package
axiosRetry(instance, {
	retries: MAX_RETRIES,
	retryDelay: getRetryMS,
	onRetry(retryCount, error, requestConfig) {
		requestConfig.ctx.warn(
			`Retriable error on ${formatRequestInfo(requestConfig)}. Retrying in ${getRetryMS(retryCount)}ms. Error details: ${JSON.stringify(error.toJSON())}`
		);
	},
	onMaxRetryTimesExceeded(error, retryCount) {
		error.config?.ctx.error(
			`${capitalize(formatRequestInfo(error.config))} failed after ${retryCount} attempts. Error details: ${JSON.stringify(error.toJSON())}`
		);
	},
	retryCondition(error) {
		const shouldRetry = isNetworkOrIdempotentRequestError(error);
		if (shouldRetry)
			error.config?.ctx.warn(
				`Retriable error on ${formatRequestInfo(error.config)}`
			);
		else
			error.config?.ctx.error(
				`Unretriable error on ${formatRequestInfo(error.config)}: ${error.response?.status}`
			);

		return shouldRetry;
	},
});

// a mapping between domains and if they're ready for another request
const domains = new Map<string, boolean>();

// gets just the domain name of a url. "https://www.google.com/page" => "google"
export const getDomain = (url: string): string => {
	const hostname = new URL(url).hostname;
	const noEnding = hostname.slice(0, hostname.lastIndexOf("."));
	return noEnding.slice(noEnding.lastIndexOf(".") + 1);
};

// throttles based on the request's domain. Requests that have the same domain
// must bet at least REQUEST_DELAY_MS apart, but request from different domains
// can be instant.
const throttleDomain = async (url: string): Promise<void> => {
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
	config.ctx.info(capitalize(formatRequestInfo(config)) + " started");
	await throttleDomain(url);
	return config;
});

instance.interceptors.response.use((response) => {
	response.config.ctx.info(
		capitalize(formatRequestInfo(response.config)) + " succeeded"
	);
	return response;
});

// still not sure what this eslint error means
// eslint-disable-next-line @typescript-eslint/unbound-method
export const smartFetch = ResultAsync.fromThrowable(instance.get, (err) => {
	if (isAxiosError(err))
		return String(err); // should improve this later
	else throw new Error(`Unknown error received from axios: ${String(err)}`);
});

export const safeParseResult = <T extends ZodSchema>(
	expectedType: T,
	data: unknown
): Result<z.infer<T>, string> => {
	const parseResult = expectedType.safeParse(data);
	return parseResult.success
		? ok(parseResult.data)
		: err(parseResult.error.format()._errors.join("\r\n"));
};

export const fetchAndParse = <T extends ZodSchema>(
	ctx: Context,
	url: string,
	expectedType: T,
	params?: Record<string, string | number>
): ResultAsync<z.infer<T>, string> =>
	smartFetch<unknown>(url, { params, ctx }).andThen((response) =>
		safeParseResult(expectedType, response.data)
	);
