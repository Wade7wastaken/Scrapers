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
import type { Context } from "./utils";
import type { Game } from "@types";
import type { ChannelTypeId } from "effect/Channel";

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

const JSON_URL =
	"https://www.coolmathgames.com/sites/default/files/cmatgame_games_with_levels.json";

const coolmathSchema = Schema.Struct({
	game: Schema.Array(
		Schema.Struct({
			alias: Schema.String,
			title: Schema.String,
			type: Schema.Union(
				Schema.Literal("html5"),
				Schema.Literal("flash"),
				Schema.Literal("ruffle")
			),
		})
	),
});

const SUBDOMAINS = [
	"www",
	"edit",
	"edit1",
	"stage",
	"stage-edit",
	"stage2-edit",
];

const coolmath2 = () =>
	Effect.gen(function* () {
		const games = yield* makeRequest(JSON_URL, coolmathSchema);
		const nonFlashGames = games.game.filter(
			(game) => game.type !== "flash"
		);

		const results = [];

		for (const game of nonFlashGames) {
			const urls = [];
			for (const subdomain of SUBDOMAINS) {
				const gamePage = `https://${subdomain}.coolmathgames.com/0-${game.alias}`;
				urls.push(gamePage, gamePage + "/play");
			}
			results.push({
				name: game.title,
				urls,
			})
		}
		return results;
	});

const coolmath = (): Effect.Effect<
	NewGame[],
	URLParseError | HttpClientError.HttpClientError | ParseError
> =>
	makeRequest(JSON_URL, coolmathSchema).pipe(
		Effect.map((games) =>
			games.game.filter((game) => game.type !== "flash")
		),
		Effect.map((games) =>
			games.map((game) => ({
				name: game.title,
				urls: [`https://www.coolmathgames.com/0-${game.alias}`],
			}))
		)
	);

type NewGame = {
	name: string;
	urls: string[];
};

const program = Effect.all([coolmath()], { concurrency: "unbounded" }).pipe(
	Effect.tap(Console.log)
);

await Effect.runPromise(program);

debugger;
