import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

import { Result } from "neverthrow";
import { format } from "prettier";
import { z } from "zod";

import type { GroupedJson, UngroupedJson } from "@types";

import { GROUPED_OUTPUT_LOCATION, UNGROUPED_OUTPUT_LOCATION } from "@config";
import { safeParseResult, smartInspect } from "@utils/misc";

const readFile = Result.fromThrowable(
	(path: string) => readFileSync(path, "utf8"),
	smartInspect
);

const GROUPED_JSON_SCHEMA = z.record(
	z.string(),
	z.array(z.object({ name: z.string(), urls: z.array(z.string()) }))
);

const constructGroupedJson = (newGames: GroupedJson): GroupedJson =>
	readFile(GROUPED_OUTPUT_LOCATION)
		.andThen(Result.fromThrowable(JSON.parse, smartInspect))
		.andThen((parsed) => safeParseResult(GROUPED_JSON_SCHEMA, parsed))
		.map((oldGames) => ({ ...oldGames, ...newGames }))
		.match(
			(combined) => combined,
			(err) => {
				console.error(`Error constructing grouped json: ${err}`);
				return newGames;
			}
		);

const constructUngroupedJson = (
	grouped: GroupedJson,
	sites: string[]
): UngroupedJson =>
	Object.entries(grouped)
		.flatMap(([site, games]) =>
			games.map(
				({ name, urls }) =>
					[name, sites.indexOf(site), ...urls] as const
			)
		)
		.sort((a, b) => a[0].toLowerCase().localeCompare(b[0].toLowerCase()));

const validateDirectory = (location: string): void => {
	try {
		mkdirSync(location, { recursive: true });
	} catch (error) {
		console.error("Error validating directory:");
		console.error(error);
	}
};

const exportJson = (output: string, location: string): void => {
	const outputDir = path.dirname(location);
	validateDirectory(outputDir);
	writeFileSync(location, output);
};

export const processOutput = async (newGames: GroupedJson): Promise<void> => {
	const grouped = constructGroupedJson(newGames);
	const formatted = await format(JSON.stringify(grouped), {
		useTabs: true,
		parser: "json",
	});
	exportJson(formatted, GROUPED_OUTPUT_LOCATION);

	const sites = Object.keys(grouped);
	const ungrouped = constructUngroupedJson(grouped, sites);
	exportJson(
		JSON.stringify({ sites, games: ungrouped }),
		UNGROUPED_OUTPUT_LOCATION
	);
};
