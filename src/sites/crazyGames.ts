import { asyncLoop } from "../segments/asyncLoop.js";
import { cleanUp } from "../segments/cleanUp.js";
import { init } from "../segments/init.js";
import type { GameList } from "../types.js";
import { addGame } from "../utils/addGame.js";
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

export const crazyGames = async (): Promise<GameList> => {
	const { log, results } = init("CrazyGames");

	const games = new Map<string, string>();

	const tagsUrl = "https://api.crazygames.com/v3/en_US/page/tags";

	const tags = await smartFetch<TagsResponse>(log, tagsUrl);

	if (tags === undefined) return [];

	const fetchPage = async (fetchUrl: string, page = 1): Promise<void> => {
		const response = await smartFetch<GamesResponse>(log, fetchUrl, {
			paginationPage: page,
			paginationSize: 100,
		});

		if (response === undefined) return;

		for (const game of response.games.data.items) {
			log.info(`Processed game: ${game.name}`);
			games.set(game.name, game.slug);
		}

		// there's something broken here i have to fix
		if (page * 100 < response.games.data.total)
			await fetchPage(fetchUrl, page + 1);
	};

	await asyncLoop(tags.tags, async (tag) => {
		const url = `https://api.crazygames.com/v3/en_US/page/tagCategory/${tag.slug}`;
		await fetchPage(url);
	});

	for (const [name, slug] of games.entries())
		addGame(log, results, name, `https://www.crazygames.com/game/${slug}`);

	return cleanUp(log, results);
};
