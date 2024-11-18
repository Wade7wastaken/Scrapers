import { z } from "zod";

import type { SiteFunction } from "@types";

import { addGame } from "@utils/addGame";
import { fetchAndParse } from "@utils/smartFetch";

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
	// "edit1",
	// "stage",
	// "stage-edit",
	// "stage2-edit",
];

const formatUrls = (subdomain: string, name: string): string[] => {
	const gamePage = `https://${subdomain}.coolmathgames.com/0-${name}`;
	return [gamePage, gamePage + "/play"];
};

export const run: SiteFunction = (ctx) =>
	fetchAndParse(ctx, JSON_URL, SCHEMA).map(({ game }) =>
		game
			.filter(({ type }) => type !== "flash")
			.flatMap(({ title, alias }) =>
				SUBDOMAINS.map((subdomain) =>
					addGame(ctx, title, ...formatUrls(subdomain, alias))
				)
			)
	);

export const displayName = "Coolmath Games";
