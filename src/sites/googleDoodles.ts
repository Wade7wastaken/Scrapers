import { Err, Ok } from "@thames/monads";

import type { SiteFunction } from "@types";

import { asyncIterator } from "@segments/asyncIterator";
import { cleanUp } from "@segments/cleanUp";
import { fetchAndParse } from "@segments/fetchAndParse";
import { init } from "@segments/init";
import { addGame } from "@utils/addGame";

const IGNORED_GAMES = new Set([
	"Google Doodle Games",
	"More Games",
	"Which Google Doodle is most fun?",
	"What is Google Doodle used for?",
	"What is the hardest Google Doodle game?",
	"How can I do Google Doodle?",
	"Where can I play the Google Doodle?",
	"2023",
	"2024",
	"Contact",
]);

export const run: SiteFunction = async () => {
	const { ctx, results } = init("Google Doodles");

	const pageResult = await fetchAndParse(
		ctx,
		"https://sites.google.com/site/populardoodlegames/"
	);

	if (pageResult.isErr()) return Err("");
	const $ = pageResult.unwrap();

	const selector = "a[data-level]";

	await asyncIterator($(selector).toArray(), async (elem) => {
		const gameName = $(elem).text();
		const gameUrl = `https://sites.google.com${$(elem).attr("href")}`;

		if (IGNORED_GAMES.has(gameName)) return;

		const pageResult = await fetchAndParse(ctx, gameUrl);

		if (pageResult.isErr()) return;
		const $2 = pageResult.unwrap();

		const embed = $2(".w536ob")[0];

		if (embed === undefined) {
			ctx.warn(`Couldn't find an embed for ${gameName}`);
			return;
		}

		if (embed.attribs["data-code"]) {
			ctx.warn(`Page ${gameName} has data-code attribute. Skipping...`);
			return;
		}

		const url = embed.attribs["data-url"];

		if (url === undefined) {
			ctx.error(
				`Couldn't find data-url on page ${gameName}. Skipping...`
			);
			return;
		}

		addGame(ctx, results, gameName, url);
	});

	return Ok(cleanUp(ctx, results));
};
