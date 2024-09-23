import type { Context } from "@utils/context";
import type { ResultAsync } from "neverthrow";

export type NameType = string;
export type UrlType = string[];
export type SiteType = string;

export type Game = {
	name: NameType;
	urls: UrlType;
};

type GroupedJsonSite = {
	displayName: string;
	games: Game[]
}

export type GroupedJson = Record<string, GroupedJsonSite>;


// a mapping between game names and urls
export type GameMap = Map<NameType, UrlType>;

export type SiteFunction = (ctx: Context) => ResultAsync<Game[], string>;
