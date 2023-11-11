import { lowerCaseSort } from "../utils/misc";

import type { Game } from "@types";

export const processSites = async (
	sites: Promise<Game[]>[]
): Promise<Game[]> => {
	const results = await Promise.all(sites);

	// [[1, 2], [3, 4]].flat(1) => [1, 2, 3, 4]
	const resultsFlattened = results.flat(1).sort(lowerCaseSort);
	return resultsFlattened;
};
