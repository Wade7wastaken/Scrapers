import type { GameMap } from "@types";
import type { Logger } from "@utils/logger";
import { MainLogger } from "@utils/logger";

export const init = (
	loggerPrefix: string
): { log: Logger; results: GameMap } => ({
	log: new MainLogger(loggerPrefix),
	results: new Map<string, string[]>(),
});
