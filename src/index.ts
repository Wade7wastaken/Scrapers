import { writeFileSync } from "node:fs";

import { OUTPUT_LOCATION } from "./config.js";
import { coolmath } from "./sites/coolmath.js";
import { crazyGames } from "./sites/crazyGames.js";
import { googleDoodles } from "./sites/googleDoodles.js";
import { poki } from "./sites/poki.js";
import { unblocked66 } from "./sites/unblocked66.js";
import { Logger, closeFileStream } from "./utils/logger.js";
import { lowerCaseSort } from "./utils/misc.js";

const main = async (): Promise<void> => {
	const sites = [
		coolmath(),
		unblocked66(),
		googleDoodles(),
		crazyGames(),
		poki(),
	];

	const results = await Promise.all(sites);
	const resultsFlattened = results.flat(1).sort(lowerCaseSort);

	writeFileSync(
		OUTPUT_LOCATION,
		JSON.stringify({ games: resultsFlattened, sites: Logger.allSiteNames })
	);

	closeFileStream();

	debugger;
};

void main();
