import type { Context } from "./context";
import type { GameMap, NameType, UrlType } from "@types";

export function addGame(
	ctx: Context,
	results: GameMap,
	gameName: NameType,
	...gameUrls: UrlType
): void {
	ctx.info(`Game added: ${gameName}: ${JSON.stringify(gameUrls)}`);
	if (results.has(gameName)) {
		results.get(gameName)?.push(...gameUrls);
	} else {
		results.set(gameName, gameUrls);
	}
}
