import { z } from "zod";

import type { SiteFunction } from "@types";

import { cleanUp } from "@segments/cleanUp";
import { init } from "@segments/init";
import { addGame } from "@utils/addGame";
import { fetchAndParse } from "@utils/smarterFetch";

const JSON_URL =
	"https://www.coolmathgames.com/sites/default/files/cmatgame_games_with_levels.json";

const SCHEMA = z.object({
	game: z.array(
		z.object({
			alias: z.string(), // internal name
			title: z.string(), // common name
			type: z.union([
				z.literal("html5"),
				z.literal("flash"),
				z.literal("ruffle"),
			]),
		})
	),
});

const SUBDOMAINS = [
	"www",
	"edit",
	"edit1",
	"stage",
	"stage-edit",
	"stage2-edit",
];

export const run: SiteFunction = () => {
	const { ctx, results } = init("Coolmath Games");

	const fetchResult = fetchAndParse(ctx, JSON_URL, SCHEMA);

	return fetchResult.map((games) => {
		const nonFlashGames = games.game.filter(
			(game) => game.type !== "flash"
		);

		for (const game of nonFlashGames) {
			for (const subdomain of SUBDOMAINS) {
				const gamePage = `https://${subdomain}.coolmathgames.com/0-${game.alias}`;
				addGame(ctx, results, game.title, gamePage, gamePage + "/play");
			}
		}
		return cleanUp(ctx, results);
	});
};
