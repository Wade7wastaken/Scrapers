import type { Game } from "../types.js";

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
