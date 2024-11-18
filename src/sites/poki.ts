import { ResultAsync } from "neverthrow";
import { z } from "zod";

import type { Game, SiteFunction } from "@types";
import type { Context } from "@utils/context";

import { addGame } from "@utils/addGame";
import { warn } from "@utils/misc";
import { fetchAndParse } from "@utils/smartFetch";

const CATEGORY_BASE_URL = "https://api.poki.com/category/";
const CATEGORY_URL = CATEGORY_BASE_URL + "categories";
const CATEGORY_PARAMS = { site: 3 };
const CATEGORY_SCHEMA = z.object({
	related_categories: z.array(z.object({ slug: z.string() })),
});

const GAME_BASE_URL = "https://poki.com/en/g/";
const GAME_PARAMS = { site: 3, limit: 200 };
const GAME_SCHEMA = z.object({
	games: z.array(z.object({ slug: z.string(), title: z.string() })),
});

const processCategory = (
	ctx: Context,
	slug: string
): ResultAsync<Game[], never> =>
	fetchAndParse(ctx, CATEGORY_BASE_URL + slug, GAME_SCHEMA, GAME_PARAMS)
		.map(({ games }) =>
			games.map(({ slug, title }) =>
				addGame(ctx, title, GAME_BASE_URL + slug)
			)
		)
		.orElse(warn(ctx, `Error on category ${slug}`, []))
		.andTee((games) => {
			ctx.info(`Category ${slug} had ${games.length} games`);
		});

export const run: SiteFunction = (ctx) =>
	fetchAndParse(ctx, CATEGORY_URL, CATEGORY_SCHEMA, CATEGORY_PARAMS)
		.map(({ related_categories }) =>
			related_categories.map(({ slug }) => processCategory(ctx, slug))
		)
		.andThen((categoryResults) => ResultAsync.combine(categoryResults))
		.map((games) => games.flat());

export const displayName = "Poki";
