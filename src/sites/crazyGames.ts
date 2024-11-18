import { ok } from "neverthrow";
import { z } from "zod";

import type { Game, SiteFunction } from "@types";
import type { Context } from "@utils/context";
import type { ResultAsync } from "neverthrow";

import { addGame } from "@utils/addGame";
import { warn } from "@utils/misc";
import { fetchAndParse } from "@utils/smartFetch";

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
	pageNumber: number
): ResultAsync<Game[], string> =>
	fetchAndParse(ctx, ALL_GAMES_URL, ALL_GAMES_SCHEMA, {
		paginationPage: pageNumber,
		paginationSize: MAX_PAGE_SIZE,
	})
		.orElse(
			warn(ctx, `Error on page ${pageNumber}`, { games: { items: [] } })
		)
		.map(({ games: { items: games } }) =>
			games.map(({ name, slug }) =>
				addGame(ctx, name, GAME_PAGE_BASE_URL + slug)
			)
		)
		.andThen((games) =>
			games.length === 0
				? ok([])
				: getPage(ctx, pageNumber++).map((next) => [...games, ...next])
		);

export const run: SiteFunction = (ctx) => getPage(ctx, 0);

export const displayName = "CrazyGames";
