import { asyncIterator } from "../asyncIterator";
import { fetchAndParseHTML } from "../fetchAndParse";

import { processDataCode, type EmbedMatch } from "./processDataCode";

import type { GameMap } from "@types";
import type { Context } from "@utils/context";

import { addGame } from "@utils/addGame";
import { removeDuplicates } from "@utils/misc";

const SIDEBAR_SELECTOR = "a[data-level]";
const EMBED_SELECTOR = ".w536ob";

export const processGoogleSite = async (
	ctx: Context,
	results: GameMap,
	mainPageLink: string,
	IGNORED_GAMES: Set<string>,
	matches: EmbedMatch[]
): Promise<void> => {
	const pageResult = await fetchAndParseHTML(ctx, mainPageLink);

	if (pageResult.isErr()) return;
	const $ = pageResult.unwrap();

	await asyncIterator($(SIDEBAR_SELECTOR).toArray(), async (e) => {
		const elem = $(e);

		const gameName = elem.text();
		if (IGNORED_GAMES.has(gameName)) return;

		const gameUrl = `https://sites.google.com${elem.attr("href")}`;

		const pageResult = await fetchAndParseHTML(ctx, gameUrl);
		if (pageResult.isErr()) return;

		const $2 = pageResult.unwrap();

		const embeds = $2(EMBED_SELECTOR);
		if (embeds.length <= 0) ctx.warn(`No embeds on ${gameName}`);

		const links = embeds.toArray().flatMap((e, i): string[] => {
			const embed = $2(e);

			const dataUrl = embed.attr("data-url");
			const dataCode = embed.attr("data-code");

			if (dataUrl === undefined) {
				ctx.warn(`Embed ${i + 1} on ${gameName} doesn't have data-url`);
				return [];
			}

			return dataCode === undefined
				? [dataUrl]
				: processDataCode(ctx, dataCode, i, gameName, matches);
		});

		links.unshift(gameUrl);

		addGame(ctx, results, gameName, ...removeDuplicates(links));
	});
};
