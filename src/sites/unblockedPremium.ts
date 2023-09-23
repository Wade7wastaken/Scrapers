import { load } from "cheerio";

import { fetchAndParse } from "../segments/fetchAndParse.js";
import { init } from "../segments/init.js";
import { loopOverElements } from "../segments/loopOverElements.js";
import type { GameList } from "../types.js";
import { addGameFallback, addGame } from "../utils/addGame.js";

const IGNORED_GAMES = new Set(["All Unblocked Games 66 EZ", "Feedback"]);

export const unblockedPremium = async (): Promise<GameList> => {
	const { log, results } = init("Unblocked Premium");

	const $ = await fetchAndParse(
		log,
		"https://sites.google.com/view/games-unblockedd/"
	);

	if ($ === undefined) return [];

	const selector = "[data-type]";

	await loopOverElements($(selector), async (_, elem) => {
		console.log($(elem).text());
	});

	log.info("DONE");
	return results.retrieve();
};
