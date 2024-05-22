import { Err, Ok, type Result } from "@thames/monads";
import { z } from "zod";

import type { SiteFunction } from "@types";
import type { Logger } from "@utils/logger";

import { asyncIterator } from "@segments/asyncIterator";
import { cleanUp } from "@segments/cleanUp";
import { fetchAndParse } from "@segments/fetchAndParse";
import { init } from "@segments/init";
import { addGame } from "@utils/addGame";
import { exists, smartFetch } from "@utils/smartFetch";

type GamesResponse = {
	alias: string;
	title: string;
	type: string;
};

const findIframeUrl = async (
	log: Logger,
	url: string,
	gameName: string
): Promise<Result<string, string>> => {
	const pageResult = await fetchAndParse(log, url);

	return pageResult.andThen(($) => {
		const gameUrl = $("iframe").attr("src");
		return gameUrl === undefined
			? Err(`Couldn't find iframe on page ${gameName}`)
			: Ok(gameUrl);
	});
};

const findBestUrl = async (
	log: Logger,
	{ alias: name, title }: GamesResponse
): Promise<string[] | undefined> => {
	const pageUrl = `https://www.coolmathgames.com/0-${name}`;
	const gameUrl = `${pageUrl}/play`;

	if (await exists(log, gameUrl)) return [pageUrl, gameUrl];

	log.warn(`Play page didn't exist for ${title}, trying game page`);

	if (!(await exists(log, pageUrl))) {
		log.error(`Game page didn't exist for ${title}, aborting`);
		return;
	}

	const iframeUrl = await findIframeUrl(log, pageUrl, title);
	return iframeUrl.isErr() ? [pageUrl] : [pageUrl, iframeUrl.unwrap()];
};

export const run: SiteFunction = async () => {
	const { log, results } = init("Coolmath Games");

	const jsonUrl =
		"https://www.coolmathgames.com/sites/default/files/cmatgame_games_with_levels.json";

	const schema = z.object({
		game: z.array(
			z.object({
				alias: z.string(), // internal name
				title: z.string(), // common name
				type: z.union([
					z.literal("html5"),
					z.literal("flash"),
					z.literal("ruffle"),
				]),
			})
		),
	});

	const fetchResult = await smartFetch(log, jsonUrl, schema);

	if (fetchResult.isErr()) return Err(fetchResult.unwrapErr());

	// should be safe but i haven't found a more elegant way yet
	const games = fetchResult.unwrap();

	// const games = schema.parse(response);

	const nonFlashGames = games.game.filter((game) => game.type !== "flash");

	await asyncIterator(nonFlashGames, async (game) => {
		const gameUrl = await findBestUrl(log, game);
		if (gameUrl === undefined) return;

		addGame(log, results, game.title, ...gameUrl);
	});

	return cleanUp(log, results);
};
