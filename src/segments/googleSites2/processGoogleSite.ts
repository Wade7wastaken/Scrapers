import type { GameMap } from "../../types.js";
import { addGame } from "../../utils/addGame.js";
import type { Logger } from "../../utils/logger.js";
import { asyncIterator } from "../asyncIterator.js";
import { fetchAndParse } from "../fetchAndParse.js";

import { processDataCode } from "./processDataCode.js";

const SIDEBAR_SELECTOR = "a[data-level]";
const EMBED_SELECTOR = ".w536ob";

export const processGoogleSite = async (
	log: Logger,
	results: GameMap,
	mainPageLink: string,
	IGNORED_GAMES: Set<string>
): Promise<void> => {
	const $ = await fetchAndParse(log, mainPageLink);
	if ($ === undefined) return;

	await asyncIterator($(SIDEBAR_SELECTOR).toArray(), async (e) => {
		const elem = $(e);

		const gameName = elem.text();
		if (IGNORED_GAMES.has(gameName)) return;

		const gameUrl = `https://sites.google.com${elem.attr("href")}`;

		const $2 = await fetchAndParse(log, gameUrl);
		if ($2 === undefined) return;

		const embeds = $2(EMBED_SELECTOR);
		if (embeds.length <= 0) log.warn(`No embeds on ${gameName}`);

		const links = embeds.toArray().flatMap((e, i): string[] => {
			const embed = $(e);

			const dataUrl = embed.attr("data-url");
			const dataCode = embed.attr("data-code");

			if (dataUrl === undefined) {
				log.warn(`Embed ${i + 1} on ${gameName} doesn't have data-url`);
				return [];
			}

			return dataCode === undefined
				? [dataUrl]
				: processDataCode(log, dataCode, i, gameName);
		});

		addGame(log, results, gameName, links);
	});
};
