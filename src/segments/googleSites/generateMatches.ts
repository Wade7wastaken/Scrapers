import { readdir, stat, readFile } from "node:fs/promises";
import path from "node:path";

import { asyncIterator } from "@segments/asyncIterator";

const MATCHES_DIR = "./src/segments/googleSites/matches";

const generateMatches = async () => {
	const files = await readdir(MATCHES_DIR);
	await asyncIterator(files, async (file) => {
		const fullPath = path.join(MATCHES_DIR, file);
		const info = await stat(fullPath);
		if (info.isFile()) {
			const contents = await readFile(fullPath, { encoding: "utf8" });
			parseMatch(contents, file);
		}
	});
};

type Match = {
	name: string;
	segments: (string | { regex: RegExp; included: boolean })[];
};

const parseMatch = (match: string, filename: string): Match => {
	const segments = match.split("\r\n").map((line) => {
		return line.startsWith("@")
			? { regex: / /, included: line[1] == "+" }
			: line;
	});

	return {
		name: filename,
		segments,
	};
};
