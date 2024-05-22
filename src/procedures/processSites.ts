import { enabledSites } from "../siteToggle";
import {
	lowerCaseSort,
	objectEntriesTyped,
	objectFromEntriesTyped,
	promiseSettledResultToResult,
} from "../utils/misc";

import type { Game } from "@types";

import * as sites from "@sites";

export const processSites = async (): Promise<
	Record<keyof typeof sites, Game[]>
> => {
	const sitePromises = await Promise.allSettled(
		objectEntriesTyped(sites)
			.filter(([siteName, _]) => enabledSites.includes(siteName))
			.map(
				async ([siteName, site]) =>
					[siteName, await site.run()] as const
			)
	);

	return objectFromEntriesTyped(
		sitePromises
			.map((site) => promiseSettledResultToResult(site).unwrap())
			.map((a) => [a[0], a[1].unwrap().sort(lowerCaseSort)] as const)
	);
};
