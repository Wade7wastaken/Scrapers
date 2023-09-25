import { cleanUp } from "../segments/cleanUp.js";
import type { GameList, Game } from "../types.js";
import { addGame } from "../utils/addGame.js";
import { Logger } from "../utils/logger.js";
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

const log = new Logger("Poki");

export const poki = async (): Promise<GameList> => {
	const results = new ResultList<Game>();

	const games = new Map<number, PokiGame>();

	const promises: Promise<void>[] = [];

	for (let i = 0; i < 26; i++) {
		const letter = String.fromCodePoint(97 + i);

		const url = BASE_URL + letter;

		promises.push(
			smartFetch<PokiApi>(log, url).then((response) => {
				if (response === undefined) {
					log.warn(`Request to ${url} failed`);
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

	return cleanUp(log, results);
};
