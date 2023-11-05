import { MainLogger } from "@utils/logger";

import type { Logger } from "@utils/logger";
import type { GameMap } from "../types";

export const init = (
	loggerPrefix: string
): { log: Logger; results: GameMap } => ({
	log: new MainLogger(loggerPrefix),
	results: new Map<string, string[]>(),
});
