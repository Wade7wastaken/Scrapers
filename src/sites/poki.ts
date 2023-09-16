import { GameList, Game } from "../types.js";
import { addGame } from "../utils/addGame.js";
import { logger } from "../utils/logger.js";
import { ResultList } from "../utils/resultList.js";
import { smartFetch } from "../utils/smartFetch.js";

const BASE_URL = "https://api.poki.com/search/query/3?q=";

interface PokiGame {
	id: number;
	title: string;
	slug: string;
}

interface PokiApi {
	games: PokiGame[];
}

const log = logger("Poki");

export const poki = async (): Promise<GameList> => {
	const results = new ResultList<Game>();

	const games = new Map<number, PokiGame>();

	const promises: Promise<void>[] = [];

	for (let i = 0; i < 26; i++) {
		const letter = String.fromCodePoint(97 + i);

		const url = BASE_URL + letter;

		promises.push(
			smartFetch<PokiApi>(url).then((response) => {
				if (response === undefined) {
					log(`Request to ${url} failed`);
					return;
				}

				for (const game of response.games) {
					games.set(game.id, game);
				}
			})
		);
	}

	await Promise.all(promises);

	for (const [, value] of games.entries()) {
		addGame(
			log,
			results,
			value.title,
			`https://poki.com/en/g/${value.slug}`
		);
	}

	log("DONE");

	return results.retrieve();
};
