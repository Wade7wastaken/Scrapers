import { cleanUp } from "@segments/cleanUp";
import { processGoogleSite } from "@segments/googleSites/processGoogleSite";
import { init } from "@segments/init";

import type { SiteFunction } from "@types";

const IGNORED_GAMES = new Set(["All Unblocked Games 66 EZ", "Feedback"]);

export const run: SiteFunction = async () => {
	const { log, results } = init("UnblockedGames66");

	await processGoogleSite(
		log,
		results,
		"https://sites.google.com/site/unblockedgames66ez/",
		IGNORED_GAMES
	);

	return cleanUp(log, results);
};
