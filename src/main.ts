import {
	HttpClient,
	HttpClientRequest,
	HttpClientResponse,
} from "@effect/platform";
import { Schema } from "@effect/schema";
import { Console, Effect, pipe } from "effect";

import type { HttpClientError } from "@effect/platform";
import type { ParseError } from "@effect/schema/ParseResult";

import { REQUEST_DELAY_MS, REQUEST_DELAY_WAIT_MULTIPLIER } from "@config";
import type { UnknownException } from "effect/Cause";

class URLParseError {
	public readonly _tag = "URLParseError";
	public constructor(public err: UnknownException) {}
}

const getDomain = (url: string): Effect.Effect<string, URLParseError> =>
	Effect.try(() => new URL(url).hostname).pipe(
		Effect.mapError((err) => new URLParseError(err)),
		Effect.map((hostname) => hostname.slice(0, hostname.lastIndexOf("."))),
		Effect.map((noEnding) => noEnding.slice(noEnding.lastIndexOf(".") + 1))
	);

const domains = new Map<string, boolean>();

const throttleDomain = (url: string): Effect.Effect<string, URLParseError> =>
	Effect.gen(function* () {
		const domain = yield* getDomain(url);

		// make sure the domain exists in the map
		if (!domains.has(domain)) domains.set(domain, true);

		while (!domains.get(domain))
			yield* Effect.sleep(
				REQUEST_DELAY_MS * REQUEST_DELAY_WAIT_MULTIPLIER
			);

		// set it to false and after DELAY_TIME ms, set it back to true
		domains.set(domain, false);
		setTimeout(() => {
			domains.set(domain, true);
		}, REQUEST_DELAY_MS);

		return url;
	});

const makeRequest = <T>(
	url: string,
	schema: Schema.Schema<T>
): Effect.Effect<
	T,
	URLParseError | HttpClientError.HttpClientError | ParseError
> =>
	pipe(
		url,
		throttleDomain,
		Effect.tap(Console.log),
		Effect.andThen((url) =>
			HttpClientRequest.get(url).pipe(
				HttpClient.fetchOk,
				Effect.andThen(HttpClientResponse.schemaBodyJson(schema))
			)
		),
		Effect.scoped
	);

const program = Effect.all(
	[
		makeRequest("https://www.google.com/", Schema.String),
		makeRequest("https://www.google.com/", Schema.String),
		makeRequest("https://www.google.com/", Schema.String),
		makeRequest("https://www.bing.com/", Schema.String),
		makeRequest("https://www.bing.com/", Schema.String),
	],
	{ concurrency: "unbounded" }
);

await Effect.runPromise(program);

debugger;
