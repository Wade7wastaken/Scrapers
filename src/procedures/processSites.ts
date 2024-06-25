import { enabledSites } from "../siteToggle";
import { objectEntriesTyped } from "../utils/misc";

import type { Game } from "@types";
import type { Context } from "@utils/index";

import * as sites from "@sites";

export type SiteNames = keyof typeof sites;

export const processSites = async (
	ctx: Context
): Promise<Record<string, Game[]>> => {
	// its safe to use Promise.all here because AsyncResults will never result in a rejected promise
	const sitePromises = await Promise.all(
		objectEntriesTyped(sites)
			.filter(([siteName, _]) => enabledSites.includes(siteName))
			.map(
				async ([siteName, site]) =>
					[siteName, await site.run()] as const
			)
	);

	const result: Record<string, Game[]> = {};

	for (const [key, value] of sitePromises) {
		value.match(
			(val) => {
				result[key] = val;
			},
			(err) => {
				ctx.error(`Error processing site ${key}: ${err}`);
			}
		);
	}

	return result;
};
