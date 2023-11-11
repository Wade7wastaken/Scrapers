import { asyncIterator } from "@segments/asyncIterator";
import { cleanUp } from "@segments/cleanUp";
import { fetchAndParse } from "@segments/fetchAndParse";
import { init } from "@segments/init";
import { addGame } from "@utils/addGame";
import { exists, smartFetch } from "@utils/smartFetch";

import type { SiteFunction } from "@types";
import type { Logger } from "@utils/logger";

interface GamesResponse {
	alias: string;
	title: string;
	type: string;
}

const findIframeUrl = async (
	log: Logger,
	url: string,
	gameName: string
): Promise<string | undefined> => {
	const $ = await fetchAndParse(log, url);
	if ($ === undefined) return undefined;

	const iframe = $("iframe1");

	const gameUrl = iframe.attr("src");
	if (gameUrl === undefined) {
		log.warn(`Couldn't find iframe on page ${gameName}`);
		return undefined;
	}

	return gameUrl;
};

const findBestUrl = async (
	log: Logger,
	{ alias: name, title }: GamesResponse
): Promise<string | undefined> => {
	const pageUrl = `https://www.coolmathgames.com${name}`;

	const gameUrl = `${pageUrl}/play`;
	if (await exists(log, gameUrl)) return gameUrl;

	log.warn(`Need to find iframe url manually on ${title}`);

	const iframeUrl = await findIframeUrl(log, pageUrl, title);
	if (iframeUrl !== undefined) return iframeUrl;

	log.error(`Couldn't find iframe url on ${title}`);

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
