import { GROUPED_OUTPUT_LOCATION, UNGROUPED_OUTPUT_LOCATION } from "@config";
import { FileSystem } from "@effect/platform";
import { NodeFileSystem, NodeRuntime } from "@effect/platform-node";
import {
	Effect,
	Data,
	Schema,
	Layer,
	pipe,
	Console,
	Either,
	Schedule,
	Context,
	Ref,
	Clock,
	HashSet,
	HashMap,
	Option,
	Logger,
} from "effect";
import { format } from "prettier";

import * as sites from "@sites";
import { enabledSites } from "./siteToggle";

const Game = Schema.Struct({
	name: Schema.String,
	urls: Schema.Array(Schema.String),
});

export type Game = typeof Game.Type;

// first is name, second is site, rest are urls
type CompactGame = readonly [string, number, ...string[]];

const GroupedJson = Schema.Record({
	key: Schema.String,
	value: Schema.Array(Game),
});

// type GroupedJson = Record<string, Game[]>;
type GroupedJson = typeof GroupedJson.Type;

const parseGroupedJson = Schema.decodeUnknown(GroupedJson);

type UngroupedJson = CompactGame[];

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

class JsonParseError extends Data.TaggedError("JsonParseError")<{
	err: string;
}> {}

const parseJsonSafe = (
	s: string
): Effect.Effect<unknown, JsonParseError, never> =>
	Effect.try({
		try: () => JSON.parse(s),
		catch: (err) => new JsonParseError({ err: String(err) }),
	});

class PrettierError extends Data.TaggedError("PrettierError")<{
	err: unknown;
}> {}

const prettyJson = (o: unknown): Effect.Effect<string, PrettierError, never> =>
	Effect.tryPromise({
		try: async () =>
			await format(JSON.stringify(o), { parser: "json", useTabs: true }),
		catch: (err) => new PrettierError({ err }),
	});

const uglyJson = (o: unknown): string => JSON.stringify(o);

class ResultsWriter extends Effect.Service<ResultsWriter>()("ResultsWriter", {
	effect: Effect.gen(function* () {
		const fs = yield* FileSystem.FileSystem;
		const write = (newResults: GroupedJson) =>
			Effect.gen(function* () {
				const oldResults = yield* pipe(
					GROUPED_OUTPUT_LOCATION,
					fs.readFileString,
					Effect.andThen(parseJsonSafe),
					Effect.andThen(parseGroupedJson)
				);

				const combined = { ...oldResults, ...newResults };
				const prettyGrouped = yield* prettyJson(combined);
				yield* fs.writeFileString(
					GROUPED_OUTPUT_LOCATION,
					prettyGrouped
				);

				const sites = Object.keys(combined);
				const ungrouped = constructUngroupedJson(combined, sites);
				const ungroupedString = uglyJson({ sites, games: ungrouped });
				yield* fs.writeFileString(
					UNGROUPED_OUTPUT_LOCATION,
					ungroupedString
				);
			});
		return { write } as const;
	}),
	dependencies: [NodeFileSystem.layer],
}) {}

class ThrottleState extends Context.Tag("ThrottleState")<
	ThrottleState,
	Ref.Ref<HashMap.HashMap<string, boolean>>
>() {}

// const throttlea = new Map()

class HttpService extends Effect.Service<HttpService>()("HttpService", {
	effect: Effect.gen(function* () {
		const throttle = yield* ThrottleState;
		const get = (url: string) =>
			Effect.gen(function* () {
				while (
					!Option.getOrElse(
						HashMap.get(yield* Ref.get(throttle), url),
						() => true
					)
				) {
					yield* Clock.sleep(0);
				}
				yield* Ref.update(throttle, HashMap.set(url, false));

				const fetchTime = yield* Clock.currentTimeMillis;
				yield* Console.log(`fetching ${url} at ${fetchTime}`);

				yield* Effect.fork(
					Clock.sleep(1000).pipe(
						Effect.andThen(() =>
							Ref.update(throttle, HashMap.set(url, true))
						)
					)
				);

				return;
			});

		return { get } as const;
	}),
	dependencies: [Layer.effect(ThrottleState, Ref.make(HashMap.empty()))],
}) {}

Effect.gen(function* () {
	yield* Console.log("starting");
	// yield* Clock.sleep("5 seconds");
	const httpService = yield* HttpService;
	const effects = [1, 2, 3, 4, 5].map((i) => httpService.get(`same`));
	yield* Effect.all(effects, { concurrency: "unbounded" });
	// const effects = Object.entries(sites)
	// 	.filter(([name, _]) => enabledSites.includes(name))
	// 	.map(([_, site]) =>
	// 		site.run.pipe(
	// 			Effect.map((result) => [site.displayName, result] as const)
	// 		)
	// 	);
	// const results = yield* Effect.all(effects, { concurrency: "unbounded" });
	// const grouped = Object.fromEntries(results);
	// const writer = yield* ResultsWriter;
	// yield* writer.write(grouped);
	yield* Console.log("done");
}).pipe(
	Effect.provide(ResultsWriter.Default),
	Effect.provide(HttpService.Default),
	NodeRuntime.runMain
);
