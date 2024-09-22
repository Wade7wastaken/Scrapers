import { enabledSites } from "../siteToggle";

import type { GroupedJson } from "@types";

import * as sites from "@sites";
import { MainContext, type Context } from "@utils/context";
import { objectEntriesTyped } from "@utils/misc";

export type SiteNames = keyof typeof sites;

export const processSites = async (ctx: Context): Promise<GroupedJson> => {
	// its safe to use Promise.all here because AsyncResults will never result in a rejected promise
	const sitePromises = await Promise.all(
		objectEntriesTyped(sites)
			.filter(([internalName, _]) => enabledSites.includes(internalName))
			.map(async ([internalName, { displayName, run }]) => ({
				internalName,
				displayName,
				games: await run(new MainContext(displayName)),
			}))
	);

	const result: GroupedJson = {};

	for (const { displayName, internalName, games } of sitePromises) {
		games.match(
			(games) => {
				result[internalName] = { displayName, games };
			},
			(err) => {
				ctx.error(`Error processing site ${internalName}: ${err}`);
			}
		);
	}

	return result;
};
