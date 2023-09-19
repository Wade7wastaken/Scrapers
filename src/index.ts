import { writeFileSync } from "node:fs";

import { OUTPUT_LOCATION } from "./config.js";
import { coolmath } from "./sites/coolmath.js";
import { crazyGames } from "./sites/crazyGames.js";
import { googleDoodles } from "./sites/googleDoodles.js";
import { poki } from "./sites/poki.js";
import { unblocked66 } from "./sites/unblocked66.js";
import type { GameList } from "./types.js";
import { closeFileStream } from "./utils/logger.js";
import { lowerCaseSort } from "./utils/misc.js";

const main = async (): Promise<void> => {
	const siteMap = {
		//"Coolmath Games": coolmath(),
		//"Unblocked Games 66 EZ": unblocked66(),
		"Google Doodles": googleDoodles(),
		//"Crazy Games": crazyGames(),
		//Poki: poki(),
	};

	const results: Record<string, GameList> = {};

	for (const site of Object.keys(siteMap) as (keyof typeof siteMap)[]) {
		const result = await siteMap[site];

		results[site] = result.sort(lowerCaseSort);
	}

	writeFileSync(
		OUTPUT_LOCATION,
		JSON.stringify(results, Object.keys(results).sort())
	);

	closeFileStream();

	debugger;
};

void main();
