import {
	mainCleanUp,
	mainInit,
	processOutput,
	processSites,
	reportStats,
} from "./procedures";

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
 * Rust-like errors (maybe just use rust)
 *
 * Bugfixes:
 * deal with all the types scattered everywhere
 * Running tests should touch log folder or have any side effects
 * rename "log" everywhere to "ctx". Context makes more sense now because it is actually used as the context
 *
 * Config:
 */

/**
 * Utils contains small utility functions/classes that are typically used more
 * than once in site functions. Procedures contains functions that are only
 * called once in init/takedown of the program. Segments are used in site
 * programs and are also mostly used procedurally. Segments are the Procedures
 * for site functions.
 */

const main = async (): Promise<void> => {
	const ctx = mainInit();

	const results = await processSites(ctx);

	processOutput(results);
	reportStats(ctx);
	mainCleanUp();

	// this is here so i can view the final variables in VSCode.
	// eslint-disable-next-line no-debugger
	debugger;
};

void main();
