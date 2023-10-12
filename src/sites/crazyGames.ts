import { asyncIterator } from "../segments/asyncIterator.js";
import { cleanUp } from "../segments/cleanUp.js";
import { init } from "../segments/init.js";
import type { GameList, GameMap } from "../types.js";
import { addGame } from "../utils/addGame.js";
import type { Logger } from "../utils/logger.js";
import { smartFetch } from "../utils/smartFetch.js";

interface TagsResponse {
	tags: {
		slug: string;
	}[];
}

interface GamesResponse {
	games: {
		data: {
			items: {
				name: string;
				slug: string;
			}[];
			total: number;
		};
	};
}

// seems to be a hard limit for the crazy games api
const MAX_PAGE_SIZE = 100;

const fetchPage = async (
	log: Logger,
	results: GameMap,
	fetchUrl: string,
	page = 1
): Promise<void> => {
	const response = await smartFetch<GamesResponse>(log, fetchUrl, {
		paginationPage: page,
		paginationSize: MAX_PAGE_SIZE,
	});

	if (response === undefined) return;

	const items = response.games.data.items;

	for (const { name, slug } of items)
		addGame(log, results, name, `https://www.crazygames.com/game/${slug}`);

	// if the api returned the max number of games (meaning there's probably
	// more on the next page)
	if (items.length === MAX_PAGE_SIZE)
		await fetchPage(log, results, fetchUrl, page + 1);
};

export const crazyGames = async (): Promise<GameList> => {
	const { log, results } = init("CrazyGames");

	const tagsUrl = "https://api.crazygames.com/v3/en_US/page/tags";

	const tags = await smartFetch<TagsResponse>(log, tagsUrl);

	if (tags === undefined) return [];

	await asyncIterator(tags.tags, async (tag) => {
		const url = `https://api.crazygames.com/v3/en_US/page/tagCategory/${tag.slug}`;
		await fetchPage(log, results, url);
	});

	return cleanUp(log, results);
};
