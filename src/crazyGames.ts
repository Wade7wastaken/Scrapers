import { Game, GameList } from "./types.js";
import { ResultList, addGame, logger, smart_fetch } from "./utils.js";

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

	const tags = await smart_fetch<TagsResponse>(tagsUrl);

	if (tags === undefined) {
		log(`Request to ${tagsUrl} failed`);
		return [];
	}

	for (const tag of tags.tags) {
		let done = false;

		const url = `https://api.crazygames.com/v3/en_US/page/tagCategory/${tag.slug}`;

		promises.push(
			smart_fetch<GamesResponse>(url, {
				paginationPage: 1,
				paginationSize: 100,
			}).then((response) => {
				if (response === undefined) {
					log(`Request to ${url} failed`);
					return;
				}

				const items = response.games.data.items;

				if (items.length === 0) done = true;

				for (const game of response.games.data.items) {
					log(`Processed game: ${game.name}`);
					games.set(game.name, game.slug);
				}
			})
		);
	}

	await Promise.all(promises);

	for (const [name, slug] of games.entries()) {
		addGame(log, results, name, `https://www.crazygames.com/game/${slug}`);
	}

	return results.retrieve();
};
