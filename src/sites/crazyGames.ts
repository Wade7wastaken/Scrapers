import { asyncIterator } from "@segments/asyncIterator";
import { cleanUp } from "@segments/cleanUp";
import { init } from "@segments/init";
import { addGame } from "@utils/addGame";
import { smartFetch } from "@utils/smartFetch";
import { z } from "zod";

import type { GameMap, SiteFunction } from "@types";
import type { Logger } from "@utils/logger";

type TagsResponse = {
	tags: {
		slug: string;
	}[];
};

// seems to be a hard limit for the crazy games api
const MAX_PAGE_SIZE = 100;

const fetchPage = async (
	log: Logger,
	results: GameMap,
	fetchUrl: string,
	page = 1
): Promise<void> => {
	const response = await smartFetch<unknown>(log, fetchUrl, {
		paginationPage: page,
		paginationSize: MAX_PAGE_SIZE,
	});

	if (response === undefined) return;

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

	const parse = schema.parse(response);

	const items = parse.games.data.items;

	if (items.length === 0) return;

	for (const { name, slug } of items)
		addGame(log, results, name, `https://www.crazygames.com/game/${slug}`);
};

export const run: SiteFunction = async () => {
	const { log, results } = init("CrazyGames");

	const tagsUrl = "https://api.crazygames.com/v3/en_US/page/tags";

	const tags = await smartFetch<TagsResponse>(log, tagsUrl);

	if (tags === undefined) return [];
	const schema = z.object({
		tags: z.array(
			z.object({
				slug: z.string(),
			})
		),
	});

	const parsed = schema.parse(tags);

	await asyncIterator(parsed.tags, async (tag) => {
		const url = `https://api.crazygames.com/v3/en_US/page/tagCategory/${tag.slug}`;
		await fetchPage(log, results, url);
	});

	return cleanUp(log, results);
};
