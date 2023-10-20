import type { GameMap } from "../types.js";
import type { Logger } from "../utils/logger.js";
import { MainLogger } from "../utils/logger.js";

export const init = (
	loggerPrefix: string
): { log: Logger; results: GameMap } => ({
	log: new MainLogger(loggerPrefix),
	results: new Map<string, string[]>(),
});
