import type { Logger } from "@utils/logger.js";
import { MainLogger } from "@utils/logger.js";

import type { GameMap } from "../types.js";

export const init = (
	loggerPrefix: string
): { log: Logger; results: GameMap } => ({
	log: new MainLogger(loggerPrefix),
	results: new Map<string, string[]>(),
});
