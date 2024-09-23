import { enabledSites } from "../siteToggle";

import type { GroupedJson } from "@types";

import * as sites from "@sites";
import { MainContext, type Context } from "@utils/context";
import { objectEntriesTyped } from "@utils/misc";
import { Result, ResultAsync, safeTry } from "neverthrow";
import { fsReadFile } from "@utils/filesystem";
import { OUTPUT_LOCATION } from "@config";
import { z } from "zod";
import { safeParseResult } from "@utils/smartFetch";

export type SiteNames = keyof typeof sites;

export const processSites = async (ctx: Context): Promise<GroupedJson> => {
	// its safe to use Promise.all here because AsyncResults will never result in a rejected promise
	const sitePromises = await Promise.all(
		objectEntriesTyped(sites)
			.filter(([internalName, _]) => enabledSites.includes(internalName))
			.map(async ([internalName, { displayName, run }]) => ({
				internalName,
				displayName,
				games: await run(new MainContext(displayName)),
			}))
	);

	const result: GroupedJson = {};

	for (const { displayName, internalName, games } of sitePromises) {
		games.match(
			(games) => {
				result[internalName] = { displayName, games };
			},
			(err) => {
				ctx.error(`Error processing site ${internalName}: ${err}`);
			}
		);
	}

	return result;
};

const GROUPED_JSON_SCHEMA = z.record(
	z.string(),
	z.object({
		displayName: z.string(),
		games: z.array(
			z.object({ name: z.string(), urls: z.array(z.string()) })
		),
	})
);

const constructGroupedJson = () =>
	safeTry(async function* () {
		const previousOutput = yield* fsReadFile(OUTPUT_LOCATION).safeUnwrap();
		const parsed = yield* Result.fromThrowable(JSON.parse)(
			previousOutput
		).safeUnwrap();
		const safe = yield* safeParseResult(GROUPED_JSON_SCHEMA, parsed).safeUnwrap();
		safe satisfies GroupedJson;
		
	});
