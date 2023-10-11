import type { GameMap } from "../types.js";
import { Logger } from "../utils/logger.js";

export const init = (
	loggerPrefix: string
): { log: Logger; results: GameMap } => ({
	log: new Logger(loggerPrefix),
	results: new Map<string, string[]>(),
});
