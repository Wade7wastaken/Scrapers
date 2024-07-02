import { range } from "lodash";
import { ResultAsync, ok } from "neverthrow";
import { z } from "zod";

import type { SiteFunction } from "@types";

import { cleanUp } from "@segments/cleanUp";
import { init } from "@segments/init";
import { addGame } from "@utils/addGame";
import { fetchAndParse } from "@utils/smarterFetch";

const BASE_URL = "https://api.poki.com/search/query/3?q=";

const SCHEMA = z.object({
	games: z.array(
		z.object({
			id: z.number(),
			title: z.string(),
			slug: z.string(),
		})
	),
});

export const run: SiteFunction = () => {
	const { ctx, results } = init("Poki");

	const searchResults = range(26).map((i) => {
		const letter = String.fromCodePoint(97 + i);

		const url = BASE_URL + letter;

		return fetchAndParse(ctx, url, SCHEMA).orElse((err) => {
			ctx.warn(`Error in iteration ${i} of Poki: ${err}`);
			return ok({ games: [] });
		});
	});

	// array map
	return ResultAsync.combine(searchResults).map((games) => {
		for (const game of games) {
			// we currently don't check if the location actually exists, but the
			// poki seems stable enough
			for (const { title, slug: location } of game.games)
				addGame(
					ctx,
					results,
					title,
					`https://poki.com/en/g/${location}`
				);
		}

		return cleanUp(ctx, results);
	});
};
