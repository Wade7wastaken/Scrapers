import { asyncIterator } from "@segments/asyncIterator";
import { cleanUp } from "@segments/cleanUp";
import { init } from "@segments/init";
import type { SiteFunction } from "@types";
import { addGame } from "@utils/addGame";
import type { Logger } from "@utils/logger";
import { exists, smartFetch } from "@utils/smartFetch";


interface GamesResponse {
	alias: string;
	title: string;
	type: string;
}

const findBestUrl = async (
	log: Logger,
	{ alias: name, title }: GamesResponse
): Promise<string | undefined> => {
	const pageUrl = `https://www.coolmathgames.com${name}`;

	const gameUrl = `${pageUrl}/play`;
	if (await exists(log, gameUrl)) return gameUrl;

	log.warn(`Falling back to page url on ${title}`);

	if (await exists(log, pageUrl)) return pageUrl;

	log.error(`Couldn't find any existing pages for ${title}`);

	return undefined;
};

export const coolmath: SiteFunction = async () => {
	const { log, results } = init("Coolmath Games");

	const jsonUrl =
		"https://www.coolmathgames.com/sites/default/files/cmatgame_games_with_levels.json";

	const games = await smartFetch<GamesResponse[]>(log, jsonUrl);

	if (games === undefined) return [];

	await asyncIterator(games, async (game) => {
		const gameUrl = await findBestUrl(log, game);
		if (gameUrl === undefined) return;

		addGame(log, results, game.title, gameUrl);
	});

	return cleanUp(log, results);
};
