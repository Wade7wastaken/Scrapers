import { asyncLoop } from "@segments/asyncLoop";
import { cleanUp } from "@segments/cleanUp";
import { init } from "@segments/init";
import { addGame } from "@utils/addGame";
import { smartFetch } from "@utils/smartFetch";

import type { SiteFunction } from "@types";

const BASE_URL = "https://api.poki.com/search/query/3?q=";

type PokiGame = {
	id: number;
	title: string;
	slug: string;
};

type PokiApi = {
	games: PokiGame[];
};

export const run: SiteFunction = async () => {
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
