import { asyncLoop } from "../segments/asyncLoop.js";
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

	await asyncLoop(0, 26, 1, async (i) => {
		const letter = String.fromCodePoint(97 + i);

		const url = BASE_URL + letter;

		const response = await smartFetch<PokiApi>(log, url);

		if (response === undefined) return;

		// we currently don't check if the location actually exists, but the
		// poki seems stable enough
		for (const { title, slug: location } of response.games)
			addGame(log, results, title, `https://poki.com/en/g/${location}`);
	});

	return cleanUp(log, results);
};
