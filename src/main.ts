import {
	mainCleanUp,
	mainInit,
	processOutput,
	processSites,
	reportStats,
} from "./procedures";
import * as sites from "./sites";

/**
 * TODO:
 *
 * Features:
 * Function to process test regex match (maybe second in array?)
 * Logic to check if test was unused
 * Add stats to show how many urls for each page (kinda done)
 * Use a Set instead of array for links to avoid duplicates without additional logic
 * Logic to check if regex always matched the same value (it can be replaced by a string)
 * Response type checking
 *
 * Bugfixes:
 * all fs things should be done first
 * deal with all the types scattered everywhere
 * fix file outputs
 * Running tests should touch log folder or have any side effects
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

	const results = await processSites(
		Object.values(sites).map((site) => site.run())
	);

	await processOutput(results);
	reportStats();
	mainCleanUp();

	// this is here so i can view the final variables in VSCode.
	debugger;
};

void main();
