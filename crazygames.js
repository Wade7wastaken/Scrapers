import { load } from "cheerio";

const output = [];

(async () => {
	const games = {};

	const tagsPage = await fetch("https://www.crazygames.com/tags");
	const tagsContent = await tagsPage.text();

	const $ = load(tagsContent);

	$(".css-zuv2ks a").each(async (_, el) => {
		for (let i = 1; i < 50; i++) {
			const tagUrl = el.attribs["href"];
			const tagPage = await fetch(`${tagUrl}/${i}`);

			if (tagPage.status === 404) break;

			console.log(tagPage.status);

			const tagContent = await tagPage.text();

			const $ = load(tagContent);

			$("a.css-1fanuwr").each((_, el) => {
				games[el.attribs["href"]] = $(el).text();
			});
		}
	});

	console.log(games);
})();
