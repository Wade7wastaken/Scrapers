import { load } from "cheerio";
import { fetchDataWithDelay, smart_fetch } from "./utils.js";

const getPageContent = async (url) => {
	const page = await fetch(url);
	return await page.text();
};

const getPropertyFromString = (string, name) => {
	const beginningIndex = string.indexOf(`"${name}":`);

	return JSON.parse(
		`{${string.slice(beginningIndex, string.indexOf(",", beginningIndex))}}`
	)[name];
};

export const googleDoodles = async () => {
	const output = [];

	// start at 2010, 5
	// that's when the first interactive doodle was released
	const response = await fetch(
		"https://www.google.com/doodles/json/2023/7?hl=en"
	);
	const json = await response.json();

	const promises = [];

	json.forEach((element) => {
		promises.push(
			(async (element) => {
				const doodleUrl = `https://www.google.com/doodles/${element.name}`;

				const $ = load((await fetchDataWithDelay(doodleUrl)).data);

				const scriptData = $("script").last().html();

				if (scriptData === null) {
					console.log($.html());
					throw new Error("Couldn't find script");
				}

				const finalUrl = getPropertyFromString(
					scriptData,
					"standalone_html"
				);

				if (finalUrl.length !== 0) {
					output.push([
						getPropertyFromString(scriptData, "title"),
						finalUrl,
					]);
				}
			})(element)
		);
	});

	await Promise.all(promises);

	return output;
};
