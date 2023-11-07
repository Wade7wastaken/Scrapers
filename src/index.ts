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

import type { Game } from "@types";

/**
 * TODO:
 *
 * Features:
 * Function to process test regex match (maybe second in array?)
 * Logic to check if test was unused
 * Add stats to show how many urls for each page (kinda done)
 * Use a Set instead of array for links to avoid duplicates without additional logic
 * Logic to check if regex always matched the same value (it can be replaced by a string)
 * Research prettier plugins
 * Response type checking
 *
 * Bugfixes:
 * deal with all the types scattered everywhere
 * fix file outputs
 * Running tests should touch log folder or have any side effects
 * addGame should use spread operator instead of string|string[]
 * rename "log" everywhere to "ctx". Context makes more sense now because it is actually used as the context
 * directory generation for output
 *
 * Config:
 */

const main = async (): Promise<void> => {
	init();

	const results = await processSites([
		coolmath(),
		unblockedSixSixEz(),
		googleDoodles(),
		crazyGames(),
		poki(),
		unblockedPremium(),
	]);

	// include the list of all sites so the frontend doesn't have to search for
	// them
	processOutput(results, MainLogger.allSiteNames);
	reportStats();
	cleanUp();

	// this is here so i can view the final variables in VSCode.
	debugger;
};

const init = (): void => {
	MainLogger.validateLogDirectory();
};

const processSites = async (sites: Promise<Game[]>[]): Promise<Game[]> => {
	const results = await Promise.all(sites);

	// [[1, 2], [3, 4]].flat(1) => [1, 2, 3, 4]
	const resultsFlattened = results.flat(1).sort(lowerCaseSort);
	return resultsFlattened;
};

const reportStats = (): void => {
	const log = new MainLogger("Stats");

	for (const [site, size] of resultStatistics.entries())
		log.info(`${site} had ${size} entries`);
};

const cleanUp = (): void => {
	// anything after this can't use the logger
	MainLogger.logFileStream.close();
};

void main();
