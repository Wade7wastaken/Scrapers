import { resultStatistics } from "@utils/resultStatistics.js";

import type { GameList, GameMap } from "../types.js";
import type { Logger } from "@utils/logger.js";

const processResults = (results: GameMap, site: string): GameList =>
	[...results.entries()].map(([name, urls]) => ({
		name,
		urls,
		site,
	}));

export const cleanUp = (log: Logger, results: GameMap): GameList => {
	log.info("DONE");
	log.info(results);
	resultStatistics.set(log.prefix, results.size);
	return processResults(results, log.prefix);
};
