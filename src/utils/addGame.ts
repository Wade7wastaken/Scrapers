import { Game } from "../types.js";

import { gameAddLog } from "./logger.js";
import { ResultList } from "./resultList.js";

export function addGameFallback(
	log: (message: string) => void,
	results: ResultList<Game>,
	gameName: string,
	gameUrl: string,
	errorMessage: string,
	fallbackLocation: string
): void {
	log(errorMessage);
	log(`Falling back to ${fallbackLocation}`);
	const result: Game = [gameName, gameUrl];
	gameAddLog(result.toString());
	results.add(result);
}

export function addGame(
	log: (message: string) => void,
	results: ResultList<Game>,
	gameName: string,
	gameUrl: string
): void {
	const result: Game = [gameName, gameUrl];
	log(`Game added: ${result.toString()}`);
	results.add(result);
}
