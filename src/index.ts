import { writeFileSync } from "node:fs";

import { OUTPUT_LOCATION } from "./config.js";
import { unblockedPremium } from "./sites/unblockedPremium.js";
import type { GameList } from "./types.js";
import { MainLogger } from "./utils/logger.js";
import { lowerCaseSort } from "./utils/misc.js";
import { resultStatistics } from "./utils/resultStatistics.js";

/**
 * TODO:
 * Easy way to test regex (tests!)
 * Format output to ts file
 * Show how a test case failed (give the actual and expected)
 * Function to process test regex match (maybe second in array?)
 * FINISH BEFORE PUBLISH
 * Use a Set instead of array for links to avoid duplicates without additional logic
 * Logic to check if test was unused
 * Logic to check if regex always matched the same value (it can be replaced by a string)
 * addGame should use spread operator instead of string|string[]
 * deal with all the types scattered everywhere
 */

const main = async (): Promise<void> => {
	MainLogger.validateLogDirectory();

	const sites: Promise<GameList>[] = [
		//coolmath(),
		//unblocked66(),
		//googleDoodles(),
		//crazyGames(),
		//poki(),
		unblockedPremium(),
	];

	const results = await Promise.all(sites);

	// [[1, 2], [3, 4]].flat(1) => [1, 2, 3, 4]
	const resultsFlattened = results.flat(1).sort(lowerCaseSort);

	// include the list of all sites so the frontend doesn't have to search for
	// them
	writeFileSync(
		OUTPUT_LOCATION,
		JSON.stringify({
			games: resultsFlattened,
			sites: MainLogger.allSiteNames,
		})
	);

	for (const [site, size] of resultStatistics.entries())
		console.log(`${site} had ${size} entries`);

	// important to do last
	MainLogger.logFileStream.close();

	// this is here so i can view the final variables in VSCode.
	debugger;
};

void main();
