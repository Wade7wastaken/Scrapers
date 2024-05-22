import { Ok, type Result } from "@thames/monads";

import type { Game, GameMap } from "@types";
import type { Logger } from "@utils/logger";

import { resultStatistics } from "@utils/resultStatistics";

const processResults = (results: GameMap, site: string): Game[] =>
	[...results.entries()].map(([name, urls]) => ({
		name,
		urls,
		site,
	}));

export const cleanUp = (
	log: Logger,
	results: GameMap
): Result<Game[], string> => {
	log.info("DONE");
	log.info(results);
	resultStatistics.set(log.prefix, results.size);
	return Ok(processResults(results, log.prefix));
};
