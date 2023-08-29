import { load } from "cheerio";

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

	const response = await fetch(
		"https://www.google.com/doodles/json/2023/7?hl=en"
	);
	const json = await response.json();

	json.forEach(async (element) => {
		console.log("async started");
		const doodleUrl = `https://www.google.com/doodles/${element.name}`;

		const $ = load(await getPageContent(doodleUrl));

		const scriptData = $("script").last().html();

		if (scriptData === null) {
			throw new Error("Couldn't find script");
		}

		const finalUrl = getPropertyFromString(scriptData, "standalone_html");

		if (finalUrl.length !== 0) {
			output.push([getPropertyFromString(scriptData, "title"), finalUrl]);
		}
	});

	return output;
};
