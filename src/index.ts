import { coolmath } from "@sites/coolmath";
import { crazyGames } from "@sites/crazyGames";
import { googleDoodles } from "@sites/googleDoodles";
import { poki } from "@sites/poki";
import { unblockedPremium } from "@sites/unblockedPremium";
import { unblockedSixSixEz } from "@sites/unblockedSixSixEz";
import { mainCleanUp } from "@utils/mainCleanup";
import { mainInit } from "@utils/mainInit";
import { processOutput } from "@utils/processOutput";
import { processSites } from "@utils/processSites";
import { reportStats } from "@utils/reportStats";

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
	mainInit();

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
	processOutput(results);
	reportStats();
	mainCleanUp();

	// this is here so i can view the final variables in VSCode.
	debugger;
};

void main();
