import type { GameMap } from "../types.js";

import type { Logger } from "./logger.js";

export function addGame(
	log: Logger,
	results: GameMap,
	gameName: string,
	gameUrl: string
): void {
	log.info(`Game added: ${gameName}: ${gameUrl}`);
	results.set(gameName, gameUrl);
}
