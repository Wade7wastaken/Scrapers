import type { Result } from "@thames/monads";

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

export type SiteFunction = () => Promise<Result<Game[], string>>;

export type Entries<T> = {
	[K in keyof T]: [K, T[K]];
}[keyof T][];
