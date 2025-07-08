import { HttpService, logGame, type Game } from "../main";
import { Console, Effect, Schema } from "effect";
import { HttpClientRequest, HttpClientResponse } from "@effect/platform";

const JSON_URL =
	"https://www.coolmathgames.com/sites/default/files/cmatgame_games_with_levels.json";

const SCHEMA = Schema.Struct({
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

// const SCHEMA = z.object({
// 	game: z.array(
// 		z.object({
// 			alias: z.string(), // internal name
// 			title: z.string(), // common name
// 			type: z.union([
// 				z.literal("html5"),
// 				z.literal("flash"),
// 				z.literal("ruffle"),
// 			]),
// 		})
// 	),
// });

const SUBDOMAINS = [
	"www",
	"edit",
	// "edit1",
	// "stage",
	// "stage-edit",
	// "stage2-edit",
];

const formatUrls = (subdomain: string, name: string): string[] => {
	const gamePage = `https://${subdomain}.coolmathgames.com/0-${name}`;
	return [gamePage + "/play", gamePage];
};

// export const run_old: SiteFunction = (ctx) =>
// 	fetchAndParse(ctx, JSON_URL, SCHEMA).map(({ game }) =>
// 		game
// 			.filter(({ type }) => type !== "flash")
// 			.flatMap(({ title, alias }) =>
// 				SUBDOMAINS.map((subdomain) =>
// 					newGame(ctx, title, ...formatUrls(subdomain, alias))
// 				)
// 			)
// 	);

// export const run = HttpService.pipe(
// 	Effect.andThen((client) => client.get(HttpClientRequest.get(JSON_URL))),
// 	Effect.andThen(HttpClientResponse.schemaBodyJson(SCHEMA)),
// 	Effect.map((json) =>
// 		json.game
// 			.filter(({ type }) => type !== "flash")
// 			.flatMap(({ alias, title }) =>
// 				SUBDOMAINS.map((subdomain) => ({
// 					name: title,
// 					urls: formatUrls(subdomain, alias),
// 				}))
// 			)
// 	)
// );

export const run = Effect.gen(function* () {
	yield* Console.log("starting coolmath");
	const client = yield* HttpService;
	const response = yield* client.get(HttpClientRequest.get(JSON_URL));
	const json = yield* HttpClientResponse.schemaBodyJson(SCHEMA)(response);
	return yield* Effect.all(
		json.game
			.filter(({ type }) => type !== "flash")
			.flatMap(({ alias, title }) =>
				SUBDOMAINS.map((subdomain) => ({
					name: title,
					urls: formatUrls(subdomain, alias),
				}))
			)
			.map((game) => logGame(game))
	);
});

export const displayName = "Coolmath Games";
