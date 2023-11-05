import { readFileSync, writeFileSync } from "node:fs";

import type { Game } from "@types";

import { OUTPUT_LOCATION } from "../config";

export const processOutput = (games: Game[], sites: string[]): void => {
	writeFileSync(
		OUTPUT_LOCATION,
		readFileSync("./data/outputTemplate.txt")
			.toString("utf8")
			.replace("/*CODE HERE*/", JSON.stringify({ games, sites }))
	);
};
