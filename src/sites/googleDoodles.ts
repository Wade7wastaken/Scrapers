import { asyncLoop } from "../segments/asyncLoop.js";
import { cleanUp } from "../segments/cleanUp.js";
import { fetchAndParse } from "../segments/fetchAndParse.js";
import { init } from "../segments/init.js";
import type { GameList, GameMap } from "../types.js";
import { addGame } from "../utils/addGame.js";
import type { Logger } from "../utils/logger.js";
import { smartFetch } from "../utils/smartFetch.js";

interface Doodle {
	name: string;
}

interface Month {
	year: number;
	month: number;
}

const getPropertyFromString = (input: string, name: string): string => {
	const begin = input.indexOf(`"${name}":`);
	const end = input.indexOf(",", begin);

	const property = input.slice(begin, end);

	const value = property.slice(property.indexOf(":") + 1).trim();

	return value.slice(1, -1);
};

const getDoodlesFromMonth = async (
	log: Logger,
	year: number,
	month: number,
	results: GameMap
): Promise<void> => {
	const url = `https://www.google.com/doodles/json/${year}/${month}?hl=en`;

	const response = await smartFetch<Doodle[]>(log, url);

	if (response === undefined) return;

	await asyncLoop(response, async (doodle) => {
		const doodleUrl = `https://www.google.com/doodles/${doodle.name}`;

		const $ = await fetchAndParse(log, doodleUrl);

		if ($ === undefined) return;

		const scriptData = $("script").last().html();

		if (scriptData === null) {
			log.warn(`Couldn't find script tag in a Doodle url: ${doodleUrl}`);
			return;
		}

		const finalUrl = getPropertyFromString(scriptData, "standalone_html");

		if (finalUrl === "") return;

		const doodleName = getPropertyFromString(scriptData, "title");

		addGame(log, results, doodleName, `https://www.google.com${finalUrl}`);
	});
};

const monthToIndex = (month: Month): number => month.year * 12 + month.month;

const indexToMonth = (index: number): Month => {
	const year = Math.floor(index / 12);

	return { month: index - year * 12, year };
};

export const googleDoodles = async (): Promise<GameList> => {
	const { log, results } = init("Doodles");

	const now = new Date();

	// I couldn't figure out how to get regular for loops working with
	// asyncLoop, so its back to the basics for now
	const promises: Promise<void>[] = [];

	for (
		let i = monthToIndex({ year: 2010, month: 5 });
		i <= monthToIndex({ year: now.getFullYear(), month: now.getMonth() });
		i++
	) {
		const { year, month } = indexToMonth(i);
		promises.push(getDoodlesFromMonth(log, year, month, results));
	}

	await Promise.all(promises);

	return cleanUp(log, results);
};
