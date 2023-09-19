import { load } from "cheerio";

import type { Game, GameList } from "../types.js";
import { addGame } from "../utils/addGame.js";
import { Logger } from "../utils/logger.js";
import { ResultList } from "../utils/resultList.js";
import { smartFetch } from "../utils/smartFetch.js";

/* use
https://www.coolmathgames.com/sites/default/files/cmatgame_games_with_levels.json
*/

const log = new Logger("Coolmath Games");

export const coolmath = async (): Promise<GameList> => {
	const url = "https://www.coolmathgames.com/1-complete-game-list/view-all";
	const response = await smartFetch<string>(log, url);

	if (response === undefined) {
		log.error(`Request to ${url} failed`);
		return [];
	}

	const promises: Promise<void>[] = [];

	const $ = load(response);

	const results = new ResultList<Game>();

	$(".view-all-games > .views-row").each((_, elem) => {
		promises.push(
			(async (e): Promise<void> => {
				const elem = $(e);

				if (elem.find(".icon-gamethumbnail-all-game-pg").length > 0)
					return;

				const anchor = elem.find(".game-title > a");

				const gameName = anchor.text();
				const gameUrl =
					"https://www.coolmathgames.com" + anchor.attr("href");
				const playUrl = gameUrl + "/play";

				addGame(
					log,
					results,
					gameName,
					(await smartFetch<string>(log, playUrl)) === undefined
						? gameUrl
						: playUrl
				);
			})(elem)
		);
	});

	await Promise.all(promises);

	log.info("DONE");

	return results.retrieve();
};
