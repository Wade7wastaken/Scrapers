import { cleanUp } from "../segments/cleanUp.js";
import { init } from "../segments/init.js";
import type { GameList } from "../types.js";
import { addGame } from "../utils/addGame.js";
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

export const poki = async (): Promise<GameList> => {
	const { log, results } = init("Poki");

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

				for (const { title, slug: location } of response.games)
					addGame(
						log,
						results,
						title,
						`https://poki.com/en/g/${location}`
					);
			})
		);
	}

	await Promise.all(promises);

	return cleanUp(log, results);
};
