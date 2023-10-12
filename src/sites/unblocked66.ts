import { asyncIterator } from "../segments/asyncIterator.js";
import { cleanUp } from "../segments/cleanUp.js";
import { fetchAndParse } from "../segments/fetchAndParse.js";
import { runEmbedTestCases } from "../segments/googleSitesEmbeds.js";
import { init } from "../segments/init.js";
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

	await asyncIterator($(selector).toArray(), async (elem) => {
		const gameName = $(elem).text();
		const gameUrl = `https://sites.google.com${$(elem).attr("href")}`;

		if (IGNORED_GAMES.has(gameName)) return;

		const $2 = await fetchAndParse(log, gameUrl);

		if ($2 === undefined) return;

		const embeds = $2(".w536ob");

		//debugger;

		if (embeds.length === 0) log.warn(`No embeds on ${gameName}`);

		const links = [...embeds].flatMap((embed) =>
			runEmbedTestCases(log, gameName, $(embed).parent().html() ?? "")
		);

		addGame(log, results, gameName, links);
	});

	return cleanUp(log, results);
};
