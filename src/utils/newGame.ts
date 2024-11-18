import type { Context } from "./context";
import type { Game } from "@types";

export function newGame(
	ctx: Context,
	gameName: string,
	...gameUrls: string[]
): Game {
	ctx.info(`Game added: ${gameName}: ${JSON.stringify(gameUrls)}`);
	return { name: gameName.trim(), urls: gameUrls.map((url) => url.trim()) };
}
