import { inspect } from "node:util";

import type { Game } from "../types.js";

import type { Logger } from "./logger.js";
import type { ResultList } from "./resultList.js";

export function addGameFallback(
	log: Logger,
	results: ResultList<Game>,
	gameName: string,
	gameUrl: string,
	errorMessage: string,
	fallbackLocation: string
): void {
	log.warn(errorMessage);
	log.warn(`Falling back to ${fallbackLocation}`);
	addGame(log, results, gameName, gameUrl);
}

export function addGame(
	log: Logger,
	results: ResultList<Game>,
	gameName: string,
	gameUrl: string
): void {
	const result: Game = [gameName, gameUrl];
	log.info(`Game added: ${inspect(result)}`);
	results.add(result);
}
