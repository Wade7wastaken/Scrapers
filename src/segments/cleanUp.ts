import type { Game, GameMap } from "../types.js";
import type { Logger } from "../utils/logger.js";

export const cleanUp = (log: Logger, results: GameMap): Game[] => {
	log.info("DONE");
	const site = log.prefix;
	return [...results.entries()].map(([name, urls]) => ({
		name,
		urls,
		site,
	}));
};
