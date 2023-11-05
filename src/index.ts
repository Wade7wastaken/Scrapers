import { coolmath } from "@sites/coolmath";
import { crazyGames } from "@sites/crazyGames";
import { googleDoodles } from "@sites/googleDoodles";
import { poki } from "@sites/poki";
import { unblockedPremium } from "@sites/unblockedPremium";
import { unblockedSixSixEz } from "@sites/unblockedSixSixEz";
import { MainLogger } from "@utils/logger";
import { lowerCaseSort } from "@utils/misc";
import { processOutput } from "@utils/processOutput";
import { resultStatistics } from "@utils/resultStatistics";

import type { GameList } from "./types";

/**
 * TODO:
 * Running tests should touch log folder or have any side effects
 * Function to process test regex match (maybe second in array?)
 * Add stats to show how many urls for each page
 * Use a Set instead of array for links to avoid duplicates without additional logic
 * Logic to check if test was unused
 * Logic to check if regex always matched the same value (it can be replaced by a string)
 * addGame should use spread operator instead of string|string[]
 * deal with all the types scattered everywhere
 */

const main = async (): Promise<void> => {
	MainLogger.validateLogDirectory();

	const sites: Promise<GameList>[] = [
		coolmath(),
		unblockedSixSixEz(),
		googleDoodles(),
		crazyGames(),
		poki(),
		unblockedPremium(),
	];

	const results = await Promise.all(sites);

	// [[1, 2], [3, 4]].flat(1) => [1, 2, 3, 4]
	const resultsFlattened = results.flat(1).sort(lowerCaseSort);

	// include the list of all sites so the frontend doesn't have to search for
	// them
	processOutput(resultsFlattened, MainLogger.allSiteNames);

	for (const [site, size] of resultStatistics.entries())
		console.log(`${site} had ${size} entries`);

	// important to do last
	MainLogger.logFileStream.close();

	// this is here so i can view the final variables in VSCode.
	debugger;
};

void main();
