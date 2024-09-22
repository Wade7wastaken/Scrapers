import { ok, safeTry } from "neverthrow";
import { z } from "zod";

import type { SiteFunction } from "@types";

import { cleanUp } from "@segments/cleanUp";
import { init } from "@segments/init";
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

export const run: SiteFunction = () =>
	safeTry(async function* () {
		const { ctx, results } = init("Coolmath Games");

		const games = yield* fetchAndParse(ctx, JSON_URL, SCHEMA).safeUnwrap();

		for (const game of games.game.filter((game) => game.type !== "flash")) {
			for (const subdomain of SUBDOMAINS) {
				const gamePage = `https://${subdomain}.coolmathgames.com/0-${game.alias}`;
				addGame(ctx, results, game.title, gamePage, gamePage + "/play");
			}
		}

		return ok(cleanUp(ctx, results));
	});

export const displayName = "Coolmath Games";