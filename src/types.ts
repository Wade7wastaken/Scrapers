import type { Context } from "@utils/context";
import type { ResultAsync } from "neverthrow";

export type Game = {
	name: string;
	urls: string[];
};

// first is name, second is site, rest are urls
type CompactGame = readonly [string, number, ...string[]];

export type GroupedJson = Record<string, Game[]>;

export type UngroupedJson = CompactGame[];

export type SiteFunction = (ctx: Context) => ResultAsync<Game[], string>;
