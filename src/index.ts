import { writeFileSync } from "node:fs";

import { coolmath } from "./sites/coolmath.js";
import { crazyGames } from "./sites/crazyGames.js";
import { googleDoodles } from "./sites/googleDoodles.js";
import { poki } from "./sites/poki.js";
import { unblocked66 } from "./sites/unblocked66.js";
import { GameList } from "./types.js";
import { closeFileStream } from "./utils/logger.js";
import { lowerCaseSort } from "./utils/misc.js";

const main = async (): Promise<void> => {
	const siteMap = {
		//CoolmathGames: coolmath(),
		//"Unblocked Games 66 EZ": unblocked66(),
		//"Google Doodles": googleDoodles(),
		//"Crazy Games": crazyGames(),
		Poki: poki(),
	};

	const results: Record<string, GameList> = {};

	for (const site of Object.keys(siteMap) as (keyof typeof siteMap)[]) {
		const result = await siteMap[site];

		results[site] = result.sort(lowerCaseSort);
	}

	writeFileSync(
		"./output2.json",
		JSON.stringify(results, Object.keys(results).sort())
	);

	closeFileStream();

	debugger;
};

void main();
