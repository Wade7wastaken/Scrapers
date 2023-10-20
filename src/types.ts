export type NameType = string;
export type UrlType = string[];
export type SiteType = string;

export interface Game {
	name: NameType;
	urls: UrlType;
	site: SiteType;
}

export type GameList = Game[];

// a mapping between game names and urls
export type GameMap = Map<NameType, UrlType>;

export type SiteFunction = () => Promise<GameList>;
