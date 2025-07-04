import { GROUPED_OUTPUT_LOCATION, UNGROUPED_OUTPUT_LOCATION } from "@config";
import { FileSystem } from "@effect/platform";
import { NodeFileSystem, NodeRuntime } from "@effect/platform-node";
import { Effect, Data, Schema, Layer, pipe, Console } from "effect";
import { format } from "prettier";

const Game = Schema.Struct({
	name: Schema.String,
	urls: Schema.Array(Schema.String),
});

type Game = typeof Game.Type;

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

class ResultsWriter extends Effect.Service<ResultsWriter>()("Test", {
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

const combinedLayer = Layer.provide(
	ResultsWriter.Default,
	NodeFileSystem.layer
);

const program = Effect.gen(function* () {
	yield* Console.log("starting");
	const writer = yield* ResultsWriter;
	yield* writer.write({
		SomethingNew: [{ name: "abc", urls: ["url1", "url2"] }],
	});
	yield* Console.log("done");
}).pipe(Effect.provide(combinedLayer));

NodeRuntime.runMain(program);
