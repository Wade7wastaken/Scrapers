import { asyncIterator } from "../segments/asyncIterator.js";
import { cleanUp } from "../segments/cleanUp.js";
import { fetchAndParse } from "../segments/fetchAndParse.js";
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

	const $ = await fetchAndParse(
		log,
		"https://sites.google.com/view/games-unblockedd/"
	);

	if ($ === undefined) return [];

	const selector = "[data-type]";

	await asyncIterator($(selector).toArray(), async (elem) => {
		const gameName = $(elem).text();

		if (IGNORED_GAMES.has(gameName)) return;

		const gameUrl = `https://sites.google.com${$(elem).attr("href")}`;

		const $2 = await fetchAndParse(log, gameUrl);

		if ($2 === undefined) return;

		const embeds = $2(".w536ob");

		//let bestUrl = "";

		log.info(
			`There ${embeds.length === 1 ? "is" : "are"} ${
				embeds.length
			} embeds on ${gameName}`
		);

		for (const embed of embeds) {
			const data_code = $(embed).attr("data-code");
			if (data_code === undefined) {
				const data_url = $(embed).attr("data-url");
				if (data_url === undefined) {
					log.error(
						`Couldn't find data-code or data-url in embed on ${gameName}`
					);
					return;
				}
				log.info(`data-url on page ${gameName} is ${data_url}`);
				//addGame(log, results, gameName, data_url);
			}
			log.info(data_code);
		}
	});

	return cleanUp(log, results);
};
