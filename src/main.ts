import {
	HttpClient,
	HttpClientRequest,
	HttpClientResponse,
	HttpMiddleware,
} from "@effect/platform";
import { Console, Effect, pipe } from "effect";
import { sleep } from "./utils";
import { REQUEST_DELAY_MS, REQUEST_DELAY_WAIT_MULTIPLIER } from "@config";

export const getDomain = (url: string): string => {
	const hostname = new URL(url).hostname;
	const noEnding = hostname.slice(0, hostname.lastIndexOf("."));
	return noEnding.slice(noEnding.lastIndexOf(".") + 1);
};

const domains = new Map<string, boolean>();

const throttleDomain = async (url: string): Promise<string> => {
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

	return url;
};

const throttleDomain2 = (url: string) =>
	Effect.gen(function* () {
		const domain = getDomain(url);

		// make sure the domain exists in the map
		if (!domains.has(domain)) domains.set(domain, true);

		while (!domains.get(domain))
			yield* Effect.sleep(
				REQUEST_DELAY_MS * REQUEST_DELAY_WAIT_MULTIPLIER
			);
		// yield* sleep(REQUEST_DELAY_MS * REQUEST_DELAY_WAIT_MULTIPLIER);

		// set it to false and after DELAY_TIME ms, set it back to true
		domains.set(domain, false);
		setTimeout(() => {
			domains.set(domain, true);
		}, REQUEST_DELAY_MS);

		return url;
	});

const throttleDomainEffect = (url: string) =>
	Effect.promise(async () => await throttleDomain(url));

const makeRequest = (url: string) =>
	pipe(
		url,
		throttleDomain2,
		Effect.tap(Console.log),
		// Effect.andThen((url) =>
		// 	HttpClientRequest.get(url).pipe(
		// 		HttpClient.fetch,
		// 		HttpClientResponse.text
		// 	)
		// )
		// Effect.tap(Console.log)
	);

const program = Effect.all(
	[
		makeRequest("https://www.google.com/"),
		makeRequest("https://www.google.com/"),
		makeRequest("https://www.google.com/"),
		makeRequest("https://www.bing.com/"),
		makeRequest("https://www.bing.com/"),
	],
	{ concurrency: "unbounded" }
);

void Effect.runPromise(program);
