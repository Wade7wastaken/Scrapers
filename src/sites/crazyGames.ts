import { err, ok } from "neverthrow";
import { z } from "zod";

import type { GameMap, SiteFunction } from "@types";
import type { Context } from "@utils/context";
import type { ResultAsync } from "neverthrow";

import { cleanUp } from "@segments/cleanUp";
import { init } from "@segments/init";
import { addGame } from "@utils/addGame";
import { fetchAndParse } from "@utils/smarterFetch";

// seems to be a hard limit for the crazy games api
const MAX_PAGE_SIZE = 100;

const ALL_GAMES_URL = "https://api.crazygames.com/v3/en_US/page/allGames";
const ALL_GAMES_SCHEMA = z.object({
	games: z.object({
		items: z.array(
			z.object({
				name: z.string(),
				slug: z.string(),
			})
		),
	}),
});

const GAME_PAGE_BASE_URL = "https://www.crazygames.com/game/";

const getPage = (
	ctx: Context,
	results: GameMap,
	pageNumber = 0
): ResultAsync<void, string> =>
	fetchAndParse(ctx, ALL_GAMES_URL, ALL_GAMES_SCHEMA, {
		paginationPage: pageNumber,
		paginationSize: MAX_PAGE_SIZE,
	})
		.map((response) => response.games.items)
		.andThen((games) =>
			games.length === 0 // if we're at the end
				? err("exiting recursive function")
				: ok(games)
		)
		.map((games) => {
			for (const { name, slug } of games)
				addGame(ctx, results, name, GAME_PAGE_BASE_URL + slug);
		})
		.andThen((_) => getPage(ctx, results, pageNumber + 1));

export const run: SiteFunction = () => {
	const { ctx, results } = init("CrazyGames");

	return getPage(ctx, results)
		.orElse((error) =>
			error === "exiting recursive function"
				? // eslint-disable-next-line unicorn/no-useless-undefined
					ok(undefined)
				: err(error)
		)
		.map((_) => cleanUp(ctx, results));
};
