export interface Game {
	name: string;
	url: string;
	site: string;
}

export type GameList = Game[];

// a mapping between game names and urls
export type GameMap = Map<string, string>;