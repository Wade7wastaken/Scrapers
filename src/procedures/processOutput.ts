import { readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

import { OUTPUT_LOCATION } from "@config";
import { emptyDirectory, validateDirectory } from "@utils/filesystem";
import { MainLogger } from "@utils/logger";

import type { Game } from "@types";

export const processOutput = (games: Game[]): void => {
	const outputDir = dirname(OUTPUT_LOCATION);
	validateDirectory(outputDir);
	emptyDirectory(outputDir);
	writeFileSync(
		OUTPUT_LOCATION,
		readFileSync("./src/data/outputTemplate.txt")
			.toString("utf8")
			.replace(
				"/*CODE HERE*/",
				JSON.stringify({ games, sites: MainLogger.allSiteNames })
			)
	);
};
