import { writeFileSync } from "node:fs";
import path from "node:path";

import { enabledSites } from "../siteToggle";

import type { SiteNames } from "./processSites";
import type { Game } from "@types";

import { OUTPUT_LOCATION } from "@config";
import { emptyDirectory, validateDirectory } from "@utils/filesystem";

// const appendToPreviousFile = (games: Game[]): Game[] => {
// 	try {
// 		const previous = readFileSync(OUTPUT_LOCATION, "utf8");
// 		const parsed = JSON.parse(previous) as { games: Game[] };
// 		parsed.games = [...parsed.games, ...games];
// 		return parsed.games;
// 	} catch {
// 		return games;
// 	}
// };

export const processOutput = (games: Record<SiteNames, Game[]>): void => {
	const outputDir = path.dirname(OUTPUT_LOCATION);
	validateDirectory(outputDir);
	emptyDirectory(outputDir);
	writeFileSync(
		OUTPUT_LOCATION,
		JSON.stringify({ games, sites: enabledSites })
	);
};
