import { asyncLoop } from "../segments/asyncLoop.js";
import { cleanUp } from "../segments/cleanUp.js";
import { init } from "../segments/init.js";
import type { GameList } from "../types.js";
import { addGame } from "../utils/addGame.js";
import type { Logger } from "../utils/logger.js";
import { exists, smartFetch } from "../utils/smartFetch.js";

/* use
https://www.coolmathgames.com/sites/default/files/cmatgame_games_with_levels.json
*/

interface GamesResponse {
	alias: string;
	title: string;
	type: string;
}

const findBestUrl = async (
	log: Logger,
	game: GamesResponse
): Promise<string | undefined> => {
	const gameUrl = `https://www.coolmathgames.com${game.alias}/play`;
	if (await exists(log, gameUrl)) return gameUrl;

	log.warn(`Falling back to page url on ${game.title}`);

	const pageUrl = `https://www.coolmathgames.com${game.alias}`;
	if (await exists(log, pageUrl)) return pageUrl;

	log.error(`Couldn't find any existing pages for ${game.alias}`);

	return undefined;
};

export const coolmath = async (): Promise<GameList> => {
	const { log, results } = init("Coolmath Games");

	const jsonUrl =
		"https://www.coolmathgames.com/sites/default/files/cmatgame_games_with_levels.json";

	const games = await smartFetch<GamesResponse[]>(log, jsonUrl);

	if (games === undefined) return [];

	await asyncLoop(games, async (game) => {
		const gameUrl = await findBestUrl(log, game);
		if (gameUrl === undefined) return;

		addGame(log, results, game.title, gameUrl);
	});

	return cleanUp(log, results);
};
