import type { Game, GameMap } from "@types";
import type { Context } from "@utils/context";

import { resultStatistics } from "@utils/resultStatistics";

const processResults = (results: GameMap, site: string): Game[] =>
	[...results.entries()].map(([name, urls]) => ({
		name,
		urls,
		site,
	}));

// ik its weird to return a Result here, but this function is called after
// everything is done in a site function, signaling a success
export const cleanUp = (ctx: Context, results: GameMap): Game[] => {
	ctx.info("DONE");
	ctx.info(results);
	resultStatistics.set(ctx.name, results.size);
	return processResults(results, ctx.name);
};
