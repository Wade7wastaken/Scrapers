import { cleanUp } from "../segments/cleanUp.js";
import { processGoogleSite } from "../segments/googleSites2/processGoogleSite.js";
import { init } from "../segments/init.js";
import type { GameList } from "../types.js";

const IGNORED_GAMES = new Set(["All Unblocked Games 66 EZ", "Feedback"]);

export const unblocked66 = async (): Promise<GameList> => {
	const { log, results } = init("UnblockedGames66");

	await processGoogleSite(
		log,
		results,
		"https://sites.google.com/site/unblockedgames66ez/",
		IGNORED_GAMES
	);

	return cleanUp(log, results);
};
