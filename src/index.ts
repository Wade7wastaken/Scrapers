import { writeFileSync } from "node:fs";

import { OUTPUT_LOCATION } from "./config.js";
import { coolmath } from "./sites/coolmath.js";
import { crazyGames } from "./sites/crazyGames.js";
import { googleDoodles } from "./sites/googleDoodles.js";
import { poki } from "./sites/poki.js";
import { unblocked66 } from "./sites/unblocked66.js";
import { unblockedPremium } from "./sites/unblockedPremium.js";
import type { GameList } from "./types.js";
import { Logger } from "./utils/logger.js";
import { lowerCaseSort } from "./utils/misc.js";

const main = async (): Promise<void> => {
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
