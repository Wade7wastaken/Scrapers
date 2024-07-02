import { inspect } from "node:util";

import axios, { isAxiosError } from "axios";
import { ResultAsync, err, errAsync, ok, type Result } from "neverthrow";

import { capitalize, sleep } from "./misc";

import type { Context } from "./context";
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
export const getRetryMS = (retries: number): number =>
	2 ** (retries + 1) * 1000;

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

// eslint-disable-next-line @typescript-eslint/unbound-method
const axiosGetSafe = ResultAsync.fromThrowable(axios.get, (err) => {
	if (isAxiosError(err)) {
		return err;
	} else {
		throw new Error(`Unknown error received from axios: ${String(err)}`);
	}
});

const safeParseResult = <T extends ZodSchema>(
	expectedType: T,
	data: unknown
): Result<z.infer<T>, string> => {
	const parseResult = expectedType.safeParse(data);
	return parseResult.success
		? ok(parseResult.data)
		: err(parseResult.error.format()._errors.join("\r\n"));
};

const fetchAndParse = <T extends ZodSchema>(
	url: string,
	options: AxiosRequestConfig,
	expectedType: T
): ResultAsync<z.infer<T>, string> =>
	axiosGetSafe<unknown>(url, options)
		.mapErr(String) // im turning the axios error into a string for now, probably change later
		.andThen((response) => safeParseResult(expectedType, response.data));

// a wrapper of the main fetch function to allow for retries
const fetchWrapper = async <T extends ZodSchema>(
	ctx: Context,
	url: string,
	options: AxiosRequestConfig,
	expectedType: T,
	retry = 0
): Promise<ResultAsync<z.infer<T>, string>> => {
	const requestName = `request to ${url} with options ${inspect(options)}`;

	if (retry >= MAX_RETRIES)
		return errAsync(
			`${capitalize(requestName)} failed after ${retry} attempts.`
		);

	try {
		const response = axiosGetSafe<unknown>(url, options);
		const parseResult = expectedType.safeParse(response.data);
		return parseResult.success
			? ok(parseResult.data)
			: err(parseResult.error.format()._errors.join("\r\n"));
	} catch (error) {
		if (!isAxiosError(error)) throw error;

		const retryDelay = getRetryMS(retry);

		// PR if you can clean up this error handling pls
		if (
			error.response &&
			NO_RETRY_HTTP_CODES.includes(error.response.status)
		)
			return err(
				`Unretriable HTTP code returned on request to ${requestName}: ${error.response.status}`
			);

		ctx.warn(
			`Retriable error on request to ${requestName}. Retrying in ${retryDelay}ms. Error details:`
		);
		ctx.warn(error);

		await sleep(retryDelay);

		return fetchWrapper(ctx, url, options, expectedType, retry + 1);
	}
};

export const smartFetch = async <T extends ZodSchema>(
	ctx: Context,
	url: string,
	expectedType: T,
	params?: Record<string, string | number>,
	silent = false
): Promise<Result<z.infer<T>, string>> => {
	await waitForNetwork(url);

	ctx.info(`Request started: ${url}`);

	const response = await fetchWrapper<T>(ctx, url, { params }, expectedType);

	// use silent if you want to make your own error message
	if (!silent && response.isErr()) ctx.warn(`Request to ${url} failed`);
	else ctx.info(`Request to ${url} succeeded`);

	return response;
};

export const exists = async (ctx: Context, url: string): Promise<boolean> => {
	await waitForNetwork(url);

	try {
		const response = await axios.head<unknown>(url);
		// Check if the status code is in the 200-399 range, indicating a successful request.
		const doesExist = response.status >= 200 && response.status < 400;

		if (doesExist) ctx.info(`${url} exists: returned ${response.status}`);
		else ctx.warn(`${url} doesn't exist: returned ${response.status}`);

		return doesExist;
	} catch (error) {
		if (!isAxiosError(error)) throw error;

		// Axios will throw an error for non-2xx status codes.
		ctx.error(`Axios error when checking if ${url} exists. Error details:`);
		ctx.error(error);
		return false;
	}
};
