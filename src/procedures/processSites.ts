import _ from "lodash";

import { enabledSites } from "../siteToggle";

import type { Game, GroupedJson, SiteFunction } from "@types";
import type { Result } from "neverthrow";

import * as sites from "@sites";
import { MainContext, type Context } from "@utils/context";

const executeSite = async (
	run: SiteFunction,
	displayName: string
): Promise<Result<Game[], string>> => {
	const ctx = new MainContext(displayName);
	ctx.info("START");
	const games = await run(ctx);
	ctx.info("DONE");
	return games;
};

// change to javascript's groupBy when i update typescript
const deduplicateAndMerge = (arr: Game[]): Game[] =>
	Object.entries(_.groupBy(arr, "name")).map(([name, elements]) => ({
		name,
		urls: _.uniq(elements.flatMap((el) => el.urls)),
	}));

export const processSites = async (ctx: Context): Promise<GroupedJson> => {
	const sitePromises = Object.values(sites)
		.filter(({ displayName }) => enabledSites.includes(displayName))
		.map(async ({ displayName, run }) => ({
			displayName,
			games: await executeSite(run, displayName),
		}));

	// its safe to use Promise.all here because AsyncResults will never result in a rejected promise
	const siteResults = await Promise.all(sitePromises);

	const result: GroupedJson = {};

	for (const { displayName, games } of siteResults) {
		games.match(
			(games) => {
				const sorted = deduplicateAndMerge(games).sort((a, b) =>
					a.name.toLowerCase().localeCompare(b.name.toLowerCase())
				);
				ctx.info(`${displayName} had ${sorted.length} games`);
				result[displayName] = sorted;
			},
			(err) => {
				ctx.error(`Error processing site ${displayName}: ${err}`);
			}
		);
	}

	return result;
};
