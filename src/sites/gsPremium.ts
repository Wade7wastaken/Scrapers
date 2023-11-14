import { cleanUp } from "@segments/cleanUp";
import { processGoogleSite } from "@segments/googleSites/processGoogleSite";
import { init } from "@segments/init";

import type { SiteFunction } from "@types";

const IGNORED_GAMES = new Set([
	"home",
	"Flash Games",
	"Driving Games",
	"2 Player Games",
	"Fun Games",
	"Best Games",
	"Contact",
	"Send Game!",
	"Game is Not Loading!",
	"Copyright",
]);

export const run: SiteFunction = async () => {
	const { log, results } = init("Unblocked Premium");

	await processGoogleSite(
		log,
		results,
		"https://sites.google.com/view/games-unblockedd/",
		IGNORED_GAMES
	);

	return cleanUp(log, results);
};
