import { load } from "cheerio";

import { cleanUp } from "../segments/cleanUp.js";
import { fetchAndParse } from "../segments/fetchAndParse.js";
import { init } from "../segments/init.js";
import { loopOverElements } from "../segments/loopOverElements.js";
import type { GameList } from "../types.js";
import { addGame } from "../utils/addGame.js";

const IGNORED_GAMES = new Set(["All Unblocked Games 66 EZ", "Feedback"]);

export const unblocked66 = async (): Promise<GameList> => {
	const { log, results } = init("UnblockedGames66");

	const $ = await fetchAndParse(
		log,
		"https://sites.google.com/site/unblockedgames66ez/"
	);

	if ($ === undefined) return [];

	const selector = ".aJHbb.dk90Ob.hDrhEe.HlqNPb";

	await loopOverElements($(selector), async (_, elem) => {
		const gameName = $(elem).text();
		const gameUrl = `https://sites.google.com${$(elem).attr("href")}`;

		const fallback = (message: string): void => {
			log.warn(message);
			log.warn("Falling back to full page");
			addGame(log, results, gameName, gameUrl);
		};

		if (IGNORED_GAMES.has(gameName)) return;

		const $2 = await fetchAndParse(log, gameUrl);

		if ($2 === undefined) return;

		const embed = $2(".w536ob")[0];

		if (embed === undefined) {
			fallback(`Couldn't find an embed element on ${gameUrl}`);
			return;
		}

		const data_code = embed.attribs["data-code"];

		if (data_code === undefined) {
			fallback(`Couldn't find data-code attribute on ${gameUrl}`);
			return;
		}

		const $3 = load(data_code);
		const fr = $3("#fr")[0];

		if (fr === undefined) {
			fallback(`Couldn't find an fr element on ${gameUrl}`);
			return;
		}

		const data = fr.attribs.data;

		if (data === undefined) {
			fallback(`Couldn't find data attribute on ${gameUrl}`);
			return;
		}

		const $4 = load(data);

		const iframe = $4("iframe")[0];

		if (iframe === undefined) {
			fallback(`Couldn't find an iframe element on ${gameUrl}`);
			return;
		}

		const src = iframe.attribs.src;

		if (src === undefined) {
			fallback(`Couldn't find src attribute on iframe on ${gameUrl}`);
			return;
		}

		addGame(log, results, gameName, src);
	});

	return cleanUp(log, results);
};
