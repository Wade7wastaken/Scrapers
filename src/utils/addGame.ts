import type { Logger } from "./logger.js";
import type { GameMap } from "../types.js";


export function addGame(
	log: Logger,
	results: GameMap,
	gameName: string,
	gameUrls: string | string[]
): void {
	log.info(`Game added: ${gameName}: ${JSON.stringify(gameUrls)}`);
	results.set(gameName, typeof gameUrls === "string" ? [gameUrls] : gameUrls);
}
