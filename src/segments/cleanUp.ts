import type { Game, GameMap } from "@types";
import type { Logger } from "@utils/logger";

import { resultStatistics } from "@utils/resultStatistics";

const processResults = (results: GameMap, site: string): Game[] =>
	[...results.entries()].map(([name, urls]) => ({
		name,
		urls,
		site,
	}));

// ik its weird to return a Result here, but this function is called after
// everything is done in a site function, signaling a success
export const cleanUp = (log: Logger, results: GameMap): Game[] => {
	log.info("DONE");
	log.info(results);
	resultStatistics.set(log.prefix, results.size);
	return processResults(results, log.prefix);
};
