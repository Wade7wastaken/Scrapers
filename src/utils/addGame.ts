import type { GameMap, NameType, UrlType } from "@types";
import type { Logger } from "@utils";

export function addGame(
	log: Logger,
	results: GameMap,
	gameName: NameType,
	...gameUrls: UrlType
): void {
	log.info(`Game added: ${gameName}: ${JSON.stringify(gameUrls)}`);
	if (results.has(gameName)) {
		results.get(gameName)?.push(...gameUrls);
	} else {
		results.set(gameName, gameUrls);
	}
}
