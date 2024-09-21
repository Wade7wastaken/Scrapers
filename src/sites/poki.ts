import { ResultAsync, ok, safeTry } from "neverthrow";
import { z } from "zod";

import type { SiteFunction } from "@types";
import type { Context } from "@utils/context";

import { cleanUp } from "@segments/cleanUp";
import { init } from "@segments/init";
import { addGame } from "@utils/addGame";
import { fetchAndParse } from "@utils/smartFetch";

const CATEGORIES_URL = "https://api.poki.com/category/categories?site=3";

const CATEGORIES_SCHEMA = z.object({
	related_categories: z.array(z.object({ slug: z.string() })),
});

const GAMES_SCHEMA = z.object({
	games: z.array(z.object({ slug: z.string(), title: z.string() })),
});

// maybe replace with z.infer
type Game = {
	title: string;
	slug: string;
};

const processCategory = (
	ctx: Context,
	slug: string
): ResultAsync<Game[], never> =>
	fetchAndParse(
		ctx,
		`https://api.poki.com/category/${slug}?site=3&limit=200`, // probably move params to fetchAndParse call
		GAMES_SCHEMA
	)
		.map((games) => games.games)
		.orElse((err) => {
			ctx.warn(`Error on category ${slug}: ${err}`);
			return ok([]);
		})
		.andTee((games) => {
			ctx.info(`Category ${slug} had ${games.length} games`);
		});

export const run: SiteFunction = () =>
	safeTry(async function* () {
		const { ctx, results } = init("Poki");

		const categoriesResponse = yield* fetchAndParse(
			ctx,
			CATEGORIES_URL,
			CATEGORIES_SCHEMA
		).safeUnwrap();

		const categoriesResult = categoriesResponse.related_categories.map(
			({ slug }) => processCategory(ctx, slug)
		);

		const games = yield* ResultAsync.combine(categoriesResult).safeUnwrap();

		for (const category of games) {
			for (const { title, slug } of category) {
				addGame(ctx, results, title, `https://poki.com/en/g/${slug}`);
			}
		}

		return ok(cleanUp(ctx, results));
	});
