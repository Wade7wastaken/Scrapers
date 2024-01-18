import { z } from "zod";

import type { GameMap, SiteFunction } from "@types";
import type { Logger } from "@utils/logger";

import { cleanUp } from "@segments/cleanUp";
import { init } from "@segments/init";
import { addGame } from "@utils/addGame";
import { smartFetch } from "@utils/smartFetch";

// seems to be a hard limit for the crazy games api
const MAX_PAGE_SIZE = 100;

const fetchPage = async (
	log: Logger,
	results: GameMap,
	page: number
): Promise<boolean> => {
	const response = await smartFetch<string>(
		log,
		"https://api.crazygames.com/v3/en_US/page/allGames",
		{
			paginationPage: page,
			paginationSize: MAX_PAGE_SIZE,
		}
	);

	if (response === undefined) return false;

	const schema = z.object({
		games: z.object({
			items: z.array(
				z.object({
					name: z.string(),
					slug: z.string(),
				})
			),
		}),
	});

	const {
		games: { items },
	} = schema.parse(response);

	if (items.length === 0) return false;

	for (const { name, slug } of items) {
		addGame(
			log,
			results,
			name,
			`https://www.crazygames.com/game/${slug}`,
			`https://games.crazygames.com/en_US/${slug}/index.html`
		);
	}

	return true;
};

export const run: SiteFunction = async () => {
	const { log, results } = init("CrazyGames");

	for (let i = 1; ; i++) if (!(await fetchPage(log, results, i))) break;

	return cleanUp(log, results);
};
