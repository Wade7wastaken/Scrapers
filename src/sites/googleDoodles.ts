import { asyncIterator } from "@segments/asyncIterator";
import { cleanUp } from "@segments/cleanUp";
import { fetchAndParse } from "@segments/fetchAndParse";
import { init } from "@segments/init";
import { addGame } from "@utils/addGame";

import type { SiteFunction } from "@types";

const IGNORED_GAMES = new Set([
	"Google Doodle Games",
	"More Games",
	"Which Google Doodle is most fun?",
	"What is Google Doodle used for?",
	"What is the hardest Google Doodle game?",
	"How can I do Google Doodle?",
	"Where can I play the Google Doodle?",
	"2023",
	"2024",
	"Contact",
]);

export const run: SiteFunction = async () => {
	const { log, results } = init("Google Doodles");

	const $ = await fetchAndParse(
		log,
		"https://sites.google.com/site/populardoodlegames/"
	);

	if ($ === undefined) return [];

	const selector = "a[data-level]";

	await asyncIterator($(selector).toArray(), async (elem) => {
		const gameName = $(elem).text();
		const gameUrl = `https://sites.google.com${$(elem).attr("href")}`;

		if (IGNORED_GAMES.has(gameName)) return;

		const $2 = await fetchAndParse(log, gameUrl);

		if ($2 === undefined) return;

		const embed = $2(".w536ob")[0];

		if (embed === undefined) {
			log.warn(`Couldn't find an embed for ${gameName}`);
			return;
		}

		if (embed.attribs["data-code"]) {
			log.warn(`Page ${gameName} has data-code attribute. Skipping...`);
			return;
		}

		const url = embed.attribs["data-url"];

		if (url === undefined) {
			log.error(
				`Couldn't find data-url on page ${gameName}. Skipping...`
			);
			return;
		}

		addGame(log, results, gameName, url);
	});

	return cleanUp(log, results);
};
