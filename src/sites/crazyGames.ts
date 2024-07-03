import { ok, ResultAsync } from "neverthrow";
import { z } from "zod";

import type { GameMap, SiteFunction } from "@types";
import type { Context } from "@utils/context";

import { cleanUp } from "@segments/cleanUp";
import { init } from "@segments/init";
import { addGame } from "@utils/addGame";
import { fetchAndParse } from "@utils/smarterFetch";

// seems to be a hard limit for the crazy games api
const MAX_PAGE_SIZE = 100;

const fetchPage = (
	ctx: Context,
	results: GameMap,
	fetchUrl: string,
	page = 1
): ResultAsync<void, never> => {
	const schema = z.object({
		games: z.object({
			data: z.object({
				items: z.array(
					z.object({
						name: z.string(),
						slug: z.string(),
					})
				),
				total: z.number(),
			}),
		}),
	});

	const fetchResult = fetchAndParse(ctx, fetchUrl, schema, {
		paginationPage: page,
		paginationSize: MAX_PAGE_SIZE,
	});

	return fetchResult
		.map((r) => r.games.data.items)
		.orElse((err) => {
			ctx.warn(`Error in tag ${fetchUrl} of crazyGames: ${err}`);
			return ok([]);
		})
		.map((games) => {
			for (const { name, slug } of games)
				addGame(
					ctx,
					results,
					name,
					`https://www.crazygames.com/game/${slug}`
				);
		});
};

export const run: SiteFunction = () => {
	const { ctx, results } = init("CrazyGames");

	const tagsUrl = "https://api.crazygames.com/v3/en_US/page/tags";

	const schema = z.object({
		tags: z.array(
			z.object({
				slug: z.string(),
			})
		),
	});

	const fetchResult = fetchAndParse(ctx, tagsUrl, schema);

	return fetchResult.andThen((parsed) => {
		const tagPages = parsed.tags.map((tag) => {
			const url = `https://api.crazygames.com/v3/en_US/page/tagCategory/${tag.slug}`;
			return fetchPage(ctx, results, url);
		});
		return ResultAsync.combine(tagPages).map((_) => cleanUp(ctx, results));
	});
};
