import { Err, Ok, isErr } from "@thames/monads";
import { z } from "zod";

import type { GameMap, SiteFunction } from "@types";
import type { Context } from "@utils/context";

import { asyncIterator } from "@segments/asyncIterator";
import { cleanUp } from "@segments/cleanUp";
import { init } from "@segments/init";
import { addGame } from "@utils/addGame";
import { smartFetch } from "@utils/smartFetch";

// seems to be a hard limit for the crazy games api
const MAX_PAGE_SIZE = 100;

const fetchPage = async (
	ctx: Context,
	results: GameMap,
	fetchUrl: string,
	page = 1
): Promise<void> => {
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

	const fetchResult = await smartFetch(ctx, fetchUrl, schema, {
		paginationPage: page,
		paginationSize: MAX_PAGE_SIZE,
	});

	if (fetchResult.isErr()) return;

	const parsed = fetchResult.unwrap();

	const items = parsed.games.data.items;

	if (items.length === 0) return;

	for (const { name, slug } of items)
		addGame(ctx, results, name, `https://www.crazygames.com/game/${slug}`);
};

export const run: SiteFunction =  () => {
	const { ctx, results } = init("CrazyGames");

	const tagsUrl = "https://api.crazygames.com/v3/en_US/page/tags";

	const schema = z.object({
		tags: z.array(
			z.object({
				slug: z.string(),
			})
		),
	});

	const fetchResult = await smartFetch(ctx, tagsUrl, schema);

	if (isErr(fetchResult)) return Err(fetchResult.unwrapErr());

	const parsed = fetchResult.unwrap();

	await asyncIterator(parsed.tags, async (tag) => {
		const url = `https://api.crazygames.com/v3/en_US/page/tagCategory/${tag.slug}`;
		await fetchPage(ctx, results, url);
	});

	return Ok(cleanUp(ctx, results));
};
