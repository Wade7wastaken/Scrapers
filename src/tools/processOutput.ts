import { readFileSync, writeFileSync } from "node:fs";

import { OUTPUT_LOCATION } from "@config";

import { MainLogger } from "../utils/logger";

import type { Game } from "@types";

export const processOutput = (games: Game[]): void => {
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
