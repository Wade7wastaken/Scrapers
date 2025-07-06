import { GROUPED_OUTPUT_LOCATION, UNGROUPED_OUTPUT_LOCATION } from "@config";
import {
	FileSystem,
	HttpClient,
	HttpClientRequest,
	HttpClientResponse,
} from "@effect/platform";
import {
	NodeFileSystem,
	NodeHttpClient,
	NodeRuntime,
} from "@effect/platform-node";
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
import _ from "lodash";

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
export type GroupedJson = typeof GroupedJson.Type;

const parseGroupedJson = Schema.decodeUnknown(GroupedJson);

export type UngroupedJson = CompactGame[];

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

class UrlParseError extends Data.TaggedError("UrlParseError")<{
	err: unknown;
}> {}

export class HttpService extends Effect.Service<HttpService>()("HttpService", {
	effect: Effect.gen(function* () {
		const throttle = yield* ThrottleState;
		const client = (yield* HttpClient.HttpClient).pipe(
			HttpClient.followRedirects(0)
			// HttpClient.tapRequest((req) =>
			// 	Console.log(`Request starting to ${req.toString()}`)
			// ),
			// HttpClient.tap((req) => Console.log(`Request finished to ${req.toJSON()}`))
			// HttpClient.retryTransient({
			// 	schedule: Schedule.exponential("1 second"),
			// 	times: 5,
			// })
		);
		const get = (request: HttpClientRequest.HttpClientRequest) =>
			Effect.gen(function* () {
				const parsedUrl = yield* Effect.try({
					try: () => new URL(request.url),
					catch: (err) => new UrlParseError({ err }),
				});

				const hostname = parsedUrl.hostname;
				const noEnding = hostname.slice(0, hostname.lastIndexOf("."));
				const domain = noEnding.slice(noEnding.lastIndexOf(".") + 1);

				while (
					!Option.getOrElse(
						HashMap.get(yield* Ref.get(throttle), domain),
						() => true
					)
				) {
					yield* Clock.sleep(0);
				}
				yield* Ref.update(throttle, HashMap.set(domain, false));

				const fetchTime = yield* Clock.currentTimeMillis;
				yield* Console.log(`fetching ${request.url} at ${fetchTime}`);

				const response = yield* client.execute(request);

				yield* Effect.fork(
					Clock.sleep(1000).pipe(
						Effect.andThen(() =>
							Ref.update(throttle, HashMap.set(domain, true))
						)
					)
				);

				return response;
			});

		return { get } as const;
	}),
	dependencies: [
		Layer.effect(ThrottleState, Ref.make(HashMap.empty())),
		NodeHttpClient.layer,
	],
}) {}

const deduplicateAndMerge = (arr: Game[]): Game[] =>
	Object.entries(_.groupBy(arr, "name"))
		.map(([name, elements]) => ({
			name,
			urls: _.uniq(elements.flatMap((el) => el.urls)),
		}))
		.sort((a, b) =>
			a.name.toLowerCase().localeCompare(b.name.toLowerCase())
		);

Effect.gen(function* () {
	yield* Console.log("starting");
	// yield* Clock.sleep("5 seconds");
	// const httpService = yield* HttpService;
	// const response = yield* httpService
	// 	.get(HttpClientRequest.get("https://www.google.com"))
	// 	.pipe(
	// 		Effect.zip(
	// 			httpService.get(
	// 				HttpClientRequest.get("https://www.google.com")
	// 			),
	// 			{ concurrent: true }
	// 		)
	// 	);
	// const text = yield* response[0].text;
	// yield* Console.log(text);
	// const effects = [1, 1].map((i) =>
	// 	httpService.get(HttpClientRequest.get("https://www.google.com")).pipe(
	// 		Effect.andThen((x) => x.text),
	// 		Effect.andThen((x) => Console.log(x))
	// 	)
	// );
	// const a = yield* Effect.all(effects, { concurrency: "unbounded" });
	const effects = Object.values(sites)
		.filter((site) => enabledSites.includes(site.displayName))
		.map((site) =>
			site.run.pipe(
				Effect.map((result) => [site.displayName, result] as const)
			)
		);
	const results = yield* Effect.all(effects, { concurrency: "unbounded" });
	const merged = results.map(([name, games]) => [
		name,
		deduplicateAndMerge(games),
	]);
	const grouped = Object.fromEntries(merged);
	const writer = yield* ResultsWriter;
	yield* writer.write(grouped);
	yield* Console.log("done");
}).pipe(
	Effect.provide(ResultsWriter.Default),
	Effect.provide(HttpService.Default),
	NodeRuntime.runMain
);
