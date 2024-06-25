import type { ResultAsync } from "neverthrow";

export type NameType = string;
export type UrlType = string[];
export type SiteType = string;

export type Game = {
	name: NameType;
	urls: UrlType;
	site: SiteType;
};

// a mapping between game names and urls
export type GameMap = Map<NameType, UrlType>;

export type SiteFunction = () => ResultAsync<Game[], string>;

export type Entries<T> = {
	[K in keyof T]: [K, T[K]];
}[keyof T][];
