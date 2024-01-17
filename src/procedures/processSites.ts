import { enabledSites } from "../siteToggle";
import { lowerCaseSort, objectEntriesTyped } from "../utils/misc";

import type { Game } from "@types";

import * as sites from "@sites";

export const processSites = async (): Promise<Game[]> => {
	const sitePromises = objectEntriesTyped(sites)
		.filter(([siteName]) => enabledSites.includes(siteName))
		.map(([_, site]) => site.run());

	const results = await Promise.all(sitePromises);

	// [[1, 2], [3, 4]].flat(1) => [1, 2, 3, 4]
	return results.flat().sort(lowerCaseSort);
};
