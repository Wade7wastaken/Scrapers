import { coolmath } from "@sites/coolmath";
import { crazyGames } from "@sites/crazyGames";
import { googleDoodles } from "@sites/googleDoodles";
import { poki } from "@sites/poki";
import { unblockedPremium } from "@sites/unblockedPremium";
import { unblockedSixSixEz } from "@sites/unblockedSixSixEz";

import { mainCleanUp } from "./procedures/mainCleanup";
import { mainInit } from "./procedures/mainInit";
import { processOutput } from "./procedures/processOutput";
import { processSites } from "./procedures/processSites";
import { reportStats } from "./procedures/reportStats";

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
 * rename tools to something better
 * all fs things should be done first
 * deal with all the types scattered everywhere
 * fix file outputs
 * Running tests should touch log folder or have any side effects
 * addGame should use spread operator instead of string|string[]
 * rename "log" everywhere to "ctx". Context makes more sense now because it is actually used as the context
 * directory generation for output
 *
 * Config:
 */

/**
 * Utils contains small utility functions/classes that are typically used more
 * than once in site functions. Tools contains functions that are only called
 * once in init/takedown of the program.
 */

const main = async (): Promise<void> => {
	await mainInit();

	const results = await processSites([
		//coolmath(),
		//unblockedSixSixEz(),
		//googleDoodles(),
		//crazyGames(),
		//poki(),
		//unblockedPremium(),
	]);

	await processOutput(results);
	reportStats();
	mainCleanUp();

	// this is here so i can view the final variables in VSCode.
	debugger;
};

void main();
