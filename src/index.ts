import { writeFileSync } from "node:fs";

import { LOG_LOCATION, OUTPUT_LOCATION } from "./config.js";
import { coolmath } from "./sites/coolmath.js";
import { crazyGames } from "./sites/crazyGames.js";
import { googleDoodles } from "./sites/googleDoodles.js";
import { poki } from "./sites/poki.js";
import { unblocked66 } from "./sites/unblocked66.js";
import { unblockedPremium } from "./sites/unblockedPremium.js";
import type { GameList } from "./types.js";
import { Logger } from "./utils/logger.js";
import { lowerCaseSort } from "./utils/misc.js";

/**
 * TODO:
 * Easy way to test regex (tests!)
 * Show some sort of results at the end
 * Logic to check if test was unused
 * Logic to check if regex always matched the same value (it can be replaced by a string)
 * addGame should use spread operator instead of string|string[]
 * deal with all the types scattered everywhere
 */

const main = async (): Promise<void> => {
	Logger.validateLogDirectory(LOG_LOCATION);

	const sites: Promise<GameList>[] = [
		//coolmath(),
		unblocked66(),
		//googleDoodles(),
		//crazyGames(),
		//poki(),
		//unblockedPremium(),
	];

	const results = await Promise.all(sites);

	// [[1, 2], [3, 4]].flat(1) => [1, 2, 3, 4]
	const resultsFlattened = results.flat(1).sort(lowerCaseSort);

	// include the list of all sites so the frontend doesn't have to search for
	// them
	writeFileSync(
		OUTPUT_LOCATION,
		JSON.stringify({ games: resultsFlattened, sites: Logger.allSiteNames })
	);

	// important to do last
	Logger.logFileStream.close();

	// this is here so i can view the final variables in VSCode.
	debugger;
};

void main();
