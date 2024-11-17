import { ok, safeTry } from "neverthrow";
import { z } from "zod";

import type { Game, SiteFunction } from "@types";

import { addGame } from "@utils/addGame";
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

export const run: SiteFunction = (ctx) =>
	safeTry(async function* () {
		let prevPageLength;
		let pageNumber = 1;

		const results: Game[] = [];

		do {
			const {
				games: { items: games },
			} = yield* fetchAndParse(ctx, ALL_GAMES_URL, ALL_GAMES_SCHEMA, {
				paginationPage: pageNumber,
				paginationSize: MAX_PAGE_SIZE,
			})
				.orElse((err) => {
					ctx.warn(`Error on page ${pageNumber}: ${err}`);
					return ok({
						games: { items: [] },
					});
				})
				.safeUnwrap();

			for (const { name, slug } of games) {
				results.push(addGame(ctx, name, GAME_PAGE_BASE_URL + slug));
			}

			prevPageLength = games.length;
			pageNumber++;
		} while (prevPageLength === MAX_PAGE_SIZE);

		return ok(results);
	});

export const displayName = "CrazyGames";
