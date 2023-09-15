import { load } from "cheerio";

import { Game, GameList } from "./types.js";
import { ResultList, addGame, logger, smart_fetch } from "./utils.js";

const log = logger("Doodles");

const getPropertyFromString = (inString: string, name: string): string => {
	const beginningIndex = inString.indexOf(`"${name}":`);

	const json = JSON.parse(
		`{${inString.slice(
			beginningIndex,
			inString.indexOf(",", beginningIndex)
		)}}`
	) as Record<string, string>;

	return json[name];
};

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

	const response = await smart_fetch<Doodle[]>(url);

	if (response === undefined) {
		log(`Request to ${url} failed`);
		return;
	}

	for (const doodle of response) {
		promises.push(
			(async (doodle) => {
				const doodleUrl = `https://www.google.com/doodles/${doodle.name}`;

				const doodlePage = await smart_fetch<string>(doodleUrl);

				if (doodlePage === undefined) {
					log(`Request to ${doodleUrl} failed`);
					return;
				}

				const $ = load(doodlePage);

				const scriptData = $("script").last().html();

				if (scriptData === null) {
					log(
						`Couldn't find script tag in a Doodle url: ${doodleUrl}`
					);
					return;
				}

				const finalUrl = getPropertyFromString(
					scriptData,
					"standalone_html"
				);

				if (finalUrl === "") return;

				const doodleName = getPropertyFromString(scriptData, "title");

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

	return results.retrieve();
};
