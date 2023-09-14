import { load } from "cheerio";

import { smart_fetch } from "./utils.js";

const getPropertyFromString = (inString: string, name: string): string => {
	const beginningIndex = inString.indexOf(`"${name}":`);

	const json = JSON.parse(
		`{${inString.slice(
			beginningIndex,
			inString.indexOf(",", beginningIndex)
		)}}`
	) as unknown;

	return json[name];
};

interface Doodle {
	name: string;
}

export const googleDoodles = async (): Promise<[string, string][]> => {
	const output: [string, string][] = [];

	// start at 2010, 5
	// that's when the first interactive doodle was released
	const response = await smart_fetch<Doodle[]>(
		"https://www.google.com/doodles/json/2023/7?hl=en"
	);

	if (response === undefined) return [];

	const promises = [];

	for (const doodle of response) {
		promises.push(
			(async (doodle) => {
				const doodleUrl = `https://www.google.com/doodles/${doodle.name}`;

				const doodlePage = await smart_fetch<string>(doodleUrl);

				if (doodlePage === undefined) return;

				const $ = load(doodlePage);

				const scriptData = $("script").last().html();

				if (scriptData === null) {
					console.log(
						`ERROR: Couldn't find script tag in a Doodle url: ${doodleUrl}`
					);
					return;
				}

				const finalUrl = getPropertyFromString(
					scriptData,
					"standalone_html"
				);

				if (finalUrl.length > 0) {
					output.push([
						getPropertyFromString(scriptData, "title"),
						finalUrl,
					]);
				}
			})(doodle)
		);
	}

	await Promise.all(promises);

	return output;
};
