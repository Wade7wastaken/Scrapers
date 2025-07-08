import { Chunk, Console, Effect, Option, Schema, Stream } from "effect";
import { HttpService, logGame } from "../main";
import { HttpBody, HttpClientRequest, UrlParams } from "@effect/platform";

// seems to be a hard limit for the crazy games api
const MAX_PAGE_SIZE = 100;

const ALL_GAMES_URL = "https://api.crazygames.com/v3/en_US/page/allGames";

const ALL_GAMES_SCHEMA = Schema.Struct({
	games: Schema.Struct({
		items: Schema.Array(
			Schema.Struct({
				name: Schema.String,
				slug: Schema.String,
			})
		),
	}),
});

const GAME_PAGE_BASE_URL = "https://www.crazygames.com/game/";

// const getPage = (
// 	ctx: Context,
// 	pageNumber: number
// ): ResultAsync<Game[], string> =>
// 	fetchAndParse(ctx, ALL_GAMES_URL, ALL_GAMES_SCHEMA, {
// 		paginationPage: pageNumber,
// 		paginationSize: MAX_PAGE_SIZE,
// 	})
// 		.orElse(
// 			warn(ctx, `Error on page ${pageNumber}`, { games: { items: [] } })
// 		)
// 		.map(({ games: { items: games } }) =>
// 			games.map(({ name, slug }) =>
// 				newGame(ctx, name, GAME_PAGE_BASE_URL + slug)
// 			)
// 		)
// 		.andThen((games) =>
// 			games.length === 0
// 				? ok([])
// 				: getPage(ctx, pageNumber++).map((next) => [...games, ...next])
// 		);

const getPage2 = (page: number) =>
	Effect.gen(function* () {
		const client = yield* HttpService;
		const request = HttpClientRequest.get(ALL_GAMES_URL, {
			urlParams: {
				paginationPage: page,
				paginationSize: MAX_PAGE_SIZE,
			},
		});
		yield* Console.log(request.urlParams);
		const response = yield* client.get(request);
		const json = yield* response.json;
		const parsed = yield* Schema.decodeUnknown(ALL_GAMES_SCHEMA)(json);
		return yield* Effect.all(
			parsed.games.items.map(({ name, slug }) =>
				logGame({ name, urls: [GAME_PAGE_BASE_URL + slug] })
			),
			{ concurrency: "unbounded" }
		);
		// return [{ name: "", urls: [] }];
	}).pipe(
		Effect.catchTags({
			// ParseError: (err) =>
			// 	Console.log(`ParseError: ${err.message}`).pipe(Effect.as([])),
		})
	);

export const run = Effect.gen(function* () {
	const stream = Stream.unfoldEffect(1, (pageNum) =>
		Effect.gen(function* () {
			const pageResults = yield* getPage2(pageNum);
			return pageResults.length === 0
				? Option.none()
				: Option.some([pageResults, pageNum + 1]);
		})
	);
	const flattened = Stream.flattenIterables(stream);
	const collected = yield* Stream.runCollect(flattened);
	return Chunk.toArray(collected);
});

export const displayName = "CrazyGames";

