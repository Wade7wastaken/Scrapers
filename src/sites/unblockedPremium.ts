import { cleanUp } from "../segments/cleanUp.js";
import { processGoogleSite } from "../segments/googleSites/processGoogleSite.js";
import { init } from "../segments/init.js";
import type { SiteFunction } from "../types.js";

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

export const unblockedPremium: SiteFunction = async () => {
	const { log, results } = init("Unblocked Premium");

	await processGoogleSite(
		log,
		results,
		"https://sites.google.com/view/games-unblockedd/",
		IGNORED_GAMES
	);

	return cleanUp(log, results);
};
