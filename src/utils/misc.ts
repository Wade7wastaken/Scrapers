import { existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { dirname } from "node:path";

import type { Game } from "../types.js";

export const sleep = (ms: number): Promise<void> =>
	new Promise((r) => setTimeout(r, ms));

export const lowerCaseSort = (a: Game, b: Game): number =>
	a.name.toLowerCase().localeCompare(b.name.toLowerCase());

export const capitalize = (s: string): string =>
	s[0]?.toUpperCase() + s.slice(1);

export const validateDirectory = (dir: string): void => {
	const dirName = dirname(dir);
	if (!existsSync(dirName)) mkdirSync(dirName, { recursive: true });
	for (const item of readdirSync(dirName))
		rmSync(`${dirName}/${item}`, { recursive: true });
};

export const getRegexContents = (regex: RegExp): string =>
	String(regex).slice(1, -1);

export const removeAllWhitespace = (input: string): string =>
	input.replaceAll(/\s+/g, "");
