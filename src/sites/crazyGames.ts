import { GameList, Game } from "../types.js";
import { addGame } from "../utils/addGame.js";
import { logger } from "../utils/logger.js";
import { ResultList } from "../utils/resultList.js";
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

const log = logger("CrazyGames");

export const crazyGames = async (): Promise<GameList> => {
	const results = new ResultList<Game>();

	const games = new Map<string, string>();

	const promises: Promise<void>[] = [];

	const tagsUrl = "https://api.crazygames.com/v3/en_US/page/tags";

	const tags = await smartFetch<TagsResponse>(tagsUrl);

	if (tags === undefined) {
		log(`Request to ${tagsUrl} failed`);
		return [];
	}

	const fetchPage = async (fetchUrl: string, page = 1): Promise<void> => {
		const response = await smartFetch<GamesResponse>(fetchUrl, {
			paginationPage: page,
			paginationSize: 100,
		});

		if (response === undefined) {
			log(`Request to ${fetchUrl} failed`);
			return;
		}

		for (const game of response.games.data.items) {
			log(`Processed game: ${game.name}`);
			games.set(game.name, game.slug);
		}

		if (page * 100 < response.games.data.total) {
			await fetchPage(fetchUrl, page + 1);
		}
	};

	for (const tag of tags.tags) {
		const url = `https://api.crazygames.com/v3/en_US/page/tagCategory/${tag.slug}`;

		promises.push(fetchPage(url));
	}

	await Promise.all(promises);

	for (const [name, slug] of games.entries()) {
		addGame(log, results, name, `https://www.crazygames.com/game/${slug}`);
	}

	log("DONE");

	return results.retrieve();
};
