import { cleanUp } from "@segments/cleanUp.js";
import { processGoogleSite } from "@segments/googleSites/processGoogleSite.js";
import { init } from "@segments/init.js";

import type { SiteFunction } from "../types.js";

const IGNORED_GAMES = new Set(["All Unblocked Games 66 EZ", "Feedback"]);

export const unblocked66: SiteFunction = async () => {
	const { log, results } = init("UnblockedGames66");

	await processGoogleSite(
		log,
		results,
		"https://sites.google.com/site/unblockedgames66ez/",
		IGNORED_GAMES
	);

	return cleanUp(log, results);
};
