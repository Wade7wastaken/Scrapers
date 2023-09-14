import axios, { AxiosResponse } from "axios";
import { Game } from "./types.js";

const sleep = (ms: number): Promise<void> =>
	new Promise((r) => setTimeout(r, ms));

const DELAY_TIME = 1000;

const domains = new Map();

export function logger(location: string) {
	return (message: string) => {
		console.log(`${location}: ${message}`);
	};
}

export const globalLog = logger("Game Added");

export async function smart_fetch<T>(
	url: string
): Promise<T | undefined> {
	const hostname = new URL(url).hostname;

	if (!domains.has(hostname)) {
		domains.set(hostname, true);
	}

	while (!domains.get(hostname)) {
		await sleep(DELAY_TIME / 2);
	}

	domains.set(hostname, false);
	setTimeout(() => {
		domains.set(hostname, true);
	}, DELAY_TIME);

	console.log(`request started: ${url}`);

	let response: AxiosResponse<T>;

	try {
		response = await axios.get<T>(url);
	} catch (error) {
		console.error("FETAL ERROR IN GET:");
		console.error(error);
		return undefined;
	}

	return response.data;
}

export class ResultList<T> {
	private results: T[];

	constructor() {
		this.results = [];
	}

	add(item: T): void {
		this.results.push(item);
	}

	retrieve(): T[] {
		return this.results;
	}
}

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
	globalLog(result.toString());
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
