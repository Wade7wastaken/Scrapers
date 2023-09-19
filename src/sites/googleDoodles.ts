import { load } from "cheerio";

import type { Game, GameList } from "../types.js";
import { addGame } from "../utils/addGame.js";
import { Logger } from "../utils/logger.js";
import { ResultList } from "../utils/resultList.js";
import { smartFetch } from "../utils/smartFetch.js";

const log = new Logger("Doodles");

function findPropertyValue(jsonString: string, propertyName: string): string {
	let insideString = false;
	let currentProperty = "";
	let currentValue = "";
	let foundProperty = false;

	for (const char of jsonString) {
		if (char === '"') {
			insideString = !insideString;
		} else if (insideString) {
			if (foundProperty) {
				currentValue += char;
			} else {
				currentProperty += char;
			}
		} else if (char === ":" && !foundProperty) {
			foundProperty = true;
			currentProperty = currentProperty.trim(); // Remove leading and trailing whitespace
		} else if (char === "," && foundProperty) {
			if (currentProperty === propertyName) {
				return currentValue.trim(); // Remove leading and trailing whitespace
			}
			currentProperty = "";
			currentValue = "";
			foundProperty = false;
		}
	}

	// Check the last property in case it matches
	if (foundProperty && currentProperty === propertyName) {
		return currentValue.trim(); // Remove leading and trailing whitespace
	}

	return ""; // Property not found
}

interface Doodle {
	name: string;
}

const getDoodlesFromMonth = async (
	year: number,
	month: number,
	results: ResultList<Game>,
	promises: Promise<void>[]
): Promise<void> => {
	const url = `https://www.google.com/doodles/json/${year}/${month}?hl=en`;

	const response = await smartFetch<Doodle[]>(log, url);

	if (response === undefined) {
		log.error(`Request to ${url} failed`);
		return;
	}

	for (const doodle of response) {
		promises.push(
			(async (doodle): Promise<void> => {
				const doodleUrl = `https://www.google.com/doodles/${doodle.name}`;

				const doodlePage = await smartFetch<string>(log, doodleUrl);

				if (doodlePage === undefined) {
					log.warn(`Request to ${doodleUrl} failed`);
					return;
				}

				const $ = load(doodlePage);

				const scriptData = $("script").last().html();

				if (scriptData === null) {
					log.warn(
						`Couldn't find script tag in a Doodle url: ${doodleUrl}`
					);
					return;
				}

				const finalUrl = findPropertyValue(
					scriptData,
					"standalone_html"
				);

				if (finalUrl === "") return;

				const doodleName = findPropertyValue(scriptData, "title");

				addGame(
					log,
					results,
					doodleName,
					`https://www.google.com${finalUrl}`
				);
			})(doodle)
		);
	}
};

export const googleDoodles = async (): Promise<GameList> => {
	const results = new ResultList<Game>();

	const promises: Promise<void>[] = [];

	const promises2: Promise<void>[] = [];

	for (let year = 2010; year <= 2010; year++) {
		for (let month = 1; month <= 12; month++) {
			promises2.push(getDoodlesFromMonth(year, month, results, promises));
		}
	}

	await Promise.all(promises2);

	await Promise.all(promises);

	log.info("DONE");

	return results.retrieve();
};
