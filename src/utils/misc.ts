import type { Entries, Game } from "@types";

// one liner function that could be used anywhere

export const sleep = (ms: number): Promise<void> =>
	new Promise((r) => setTimeout(r, ms));

export const lowerCaseSort = (a: Game, b: Game): number =>
	a.name.toLowerCase().localeCompare(b.name.toLowerCase());

export const capitalize = (s: string): string =>
	s[0]?.toUpperCase() + s.slice(1);

export const getRegexContents = (regex: RegExp): string =>
	String(regex).slice(1, -1);

export const removeAllWhitespace = (input: string): string =>
	input.replaceAll(/\s+/g, "");

export const removeDuplicates = <T>(arr: T[]): T[] =>
	arr.filter((value, index, self) => self.indexOf(value) === index);

export const padNumber = (time: number, len = 2): string =>
	time.toString().padStart(len, "0");

export const formatTime = (now: Date): string =>
	`${padNumber(now.getHours())}:${padNumber(now.getMinutes())}:${padNumber(
		now.getSeconds()
	)}.${padNumber(now.getMilliseconds(), 3)}`;

// https://stackoverflow.com/questions/60141960/typescript-key-value-relation-preserving-object-entries-type
export const objectEntriesTyped = <T extends object>(obj: T): Entries<T> =>
	Object.entries(obj) as Entries<T>;
