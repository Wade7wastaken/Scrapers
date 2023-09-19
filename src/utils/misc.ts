import { existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { dirname } from "node:path";

export const sleep = (ms: number): Promise<void> =>
	new Promise((r) => setTimeout(r, ms));

export const lowerCaseSort = (
	a: [string, string],
	b: [string, string]
): number => a[0].toLowerCase().localeCompare(b[0].toLowerCase());

export const capitalize = (s: string): string =>
	s[0]?.toUpperCase() + s.slice(1);

export const validateDirectory = (dir: string): void => {
	const dirName = dirname(dir);
	if (!existsSync(dirName)) mkdirSync(dirName, { recursive: true });
	for (const item of readdirSync(dirName))
		rmSync(`${dirName}/${item}`, { recursive: true });
};
