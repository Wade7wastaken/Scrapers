import type { Logger } from "./logger";
import type { GameMap, NameType, UrlType } from "@types";

export function addGame(
	log: Logger,
	results: GameMap,
	gameName: NameType,
	...gameUrls: UrlType
): void {
	log.info(`Game added: ${gameName}: ${JSON.stringify(gameUrls)}`);
	results.set(gameName, gameUrls);
}
