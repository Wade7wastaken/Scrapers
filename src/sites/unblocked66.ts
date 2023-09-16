import { load } from "cheerio";

import { GameList, Game } from "../types.js";
import { addGameFallback, addGame } from "../utils/addGame.js";
import { logger } from "../utils/logger.js";
import { ResultList } from "../utils/resultList.js";
import { smartFetch } from "../utils/smartFetch.js";

const IGNORED_GAMES = new Set(["All Unblocked Games 66 EZ", "Feedback"]);

const log = logger("UnblockedGames66");

export const unblocked66 = async (): Promise<GameList> => {
	const url = "https://sites.google.com/site/unblockedgames66ez/";
	const response = await smartFetch<string>(url);

	if (response === undefined) return [];

	const $ = load(response);

	const promises: Promise<void>[] = [];

	const results = new ResultList<Game>();

	$(".aJHbb.dk90Ob.hDrhEe.HlqNPb").each((_, elem) => {
		promises.push(
			(async (elem) => {
				const gameName = $(elem).text();
				const gameUrl = `https://sites.google.com${$(elem).attr(
					"href"
				)}`;

				if (IGNORED_GAMES.has(gameName)) return;

				const gamePage = await smartFetch<string>(gameUrl);

				if (gamePage === undefined) {
					log(`Request to ${gameUrl} failed`);
					return;
				}

				const $2 = load(gamePage);

				const embed = $2(".w536ob")[0];

				if (embed === undefined) {
					addGameFallback(
						log,
						results,
						gameName,
						gameUrl,
						`Couldn't find an embed element on ${gameUrl}`,
						"full page"
					);
					return;
				}

				const data_code = embed.attribs["data-code"];

				if (data_code === undefined) {
					addGameFallback(
						log,
						results,
						gameName,
						gameUrl,
						`Couldn't find data-code attribute on ${gameUrl}`,
						"full page"
					);
					return;
				}

				const $3 = load(data_code);
				const fr = $3("#fr")[0];

				if (fr === undefined) {
					addGameFallback(
						log,
						results,
						gameName,
						gameUrl,
						`Couldn't find an fr element on ${gameUrl}`,
						"full page"
					);
					return;
				}

				const data = fr.attribs.data;

				if (data === undefined) {
					addGameFallback(
						log,
						results,
						gameName,
						gameUrl,
						`Couldn't find data attribute on ${gameUrl}`,
						"full page"
					);
					return;
				}

				const $4 = load(data);

				const iframe = $4("iframe")[0];

				if (iframe === undefined) {
					addGameFallback(
						log,
						results,
						gameName,
						gameUrl,
						`Couldn't find an iframe element on ${gameUrl}`,
						"full page"
					);
					return;
				}

				const src = iframe.attribs.src;

				if (src === undefined) {
					addGameFallback(
						log,
						results,
						gameName,
						gameUrl,
						`Couldn't find src attribute on iframe on ${gameUrl}`,
						"full page"
					);
					return;
				}

				addGame(log, results, gameName, src);
			})(elem)
		);
	});

	await Promise.all(promises);

	log("DONE");

	return results.retrieve();
};
