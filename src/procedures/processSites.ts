import { enabledSites } from "../siteToggle";
import {
	lowerCaseSort,
	objectEntriesTyped,
	objectFromEntriesTyped,
	promiseSettledResultToResult,
} from "../utils/misc";

import type { Result } from "@thames/monads";
import type { Game } from "@types";
import type { Logger } from "@utils/index";

import * as sites from "@sites";

export type SiteNames = keyof typeof sites;

const processSite = (
	log: Logger,
	name: SiteNames,
	games: Result<Game[], string>
): [SiteNames, Game[]] => [
	name,
	games
		.match({
			ok: (val) => val,
			err(err) {
				log.error(`Error processing site ${name}: ${err}`);
				return [];
			},
		})
		.sort(lowerCaseSort),
];

export const processSites = async (
	log: Logger
): Promise<Record<SiteNames, Game[]>> => {
	const sitePromises = await Promise.allSettled(
		objectEntriesTyped(sites)
			.filter(([siteName, _]) => enabledSites.includes(siteName))
			.map(
				async ([siteName, site]) =>
					[siteName, await site.run()] as const
			)
	);

	/* should probably fix this but it only happens if something is thrown in a site function */
	return objectFromEntriesTyped(
		sitePromises
			.map((site) => promiseSettledResultToResult(site).unwrap())
			.map((a) => processSite(log, ...a))
	);
};
