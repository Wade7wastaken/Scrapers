import { Ok } from "@thames/monads";
import { z } from "zod";

import type { SiteFunction } from "@types";

import { asyncLoop } from "@segments/asyncLoop";
import { cleanUp } from "@segments/cleanUp";
import { init } from "@segments/init";
import { addGame } from "@utils/addGame";
import { smartFetch } from "@utils/smartFetch";

const BASE_URL = "https://api.poki.com/search/query/3?q=";

export const run: SiteFunction = async () => {
	const { ctx, results } = init("Poki");

	await asyncLoop(0, 10, 1, async (i) => {
		const letter = String.fromCodePoint(97 + i);

		const url = BASE_URL + letter;

		const schema = z.object({
			games: z.array(
				z.object({
					id: z.number(),
					title: z.string(),
					slug: z.string(),
				})
			),
		});

		const fetchResult = await smartFetch(ctx, url, schema);

		if (fetchResult.isErr()) {
			ctx.warn(
				`Error fetching data in iteration ${i} of Poki: ${fetchResult.unwrapErr()}`
			);
			return;
		}

		const parsed = fetchResult.unwrap();

		// we currently don't check if the location actually exists, but the
		// poki seems stable enough
		for (const { title, slug: location } of parsed.games)
			addGame(ctx, results, title, `https://poki.com/en/g/${location}`);
	});

	return Ok(cleanUp(ctx, results));
};
