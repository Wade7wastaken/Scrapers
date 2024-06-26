import type { Context } from "@utils/context";

import { capitalize, removeAllWhitespace, removeDuplicates } from "@utils/misc";
import { ResultList } from "@utils/resultList";

// regex's that are the result of the match are an array of 1 regex
export type EmbedMatchSegment = string | RegExp | [RegExp];

export type EmbedMatch = {
	name: string;
	segments: EmbedMatchSegment[];
};

export type EmbedMatchWithTest = {
	embedMatch: EmbedMatch;
	test: {
		data: string;
		result: string[];
	};
};

export type EmbedMatchResult = {
	matched: boolean;
	urls?: string[];
};

export const removeTest = (matches: EmbedMatchWithTest[]): EmbedMatch[] =>
	matches.map((match) => match.embedMatch);

export const runMatch = (
	ctx: Context,
	embed: string,
	embedIndex: number,
	embedMatch: EmbedMatch,
	gameName: string
): EmbedMatchResult => {
	const matchLocation = `game: ${gameName}, embed index: ${embedIndex}, match name: ${embedMatch.name}`;

	const noMatch = (
		location: "string" | "regex",
		index: number,
		wanted?: string,
		got?: string
	): EmbedMatchResult => {
		ctx.info(
			`${capitalize(
				location
			)} didn't match. ${matchLocation}, segment: ${index}${
				wanted !== undefined && got !== undefined
					? `, wanted: ${wanted}, got: ${got}`
					: ""
			}`
		);
		return { matched: false };
	};

	const results = new ResultList<string>(true);

	if (embedMatch.segments.length === 0)
		return embed === ""
			? {
					matched: true,
					urls: [],
				}
			: noMatch("string", -1);

	for (const [index, segment] of embedMatch.segments.entries()) {
		if (typeof segment === "string") {
			const trimmedSegment = removeAllWhitespace(segment);
			if (embed.startsWith(trimmedSegment))
				embed = embed.slice(trimmedSegment.length);
			else
				return noMatch(
					"string",
					index,
					trimmedSegment,
					embed.slice(0, trimmedSegment.length + 10)
				);

			continue;
		}
		const isOutputtedRegex = Array.isArray(segment);
		const regex = isOutputtedRegex ? segment[0] : segment;

		const execResult = regex.exec(embed);
		if (execResult === null) return noMatch("regex", index, embed, "");

		const matchedString = execResult[0];
		embed = embed.slice(matchedString.length);
		if (isOutputtedRegex) results.add(matchedString);
	}

	// we haven't returned in the loop, so there is a match
	ctx.info(`Match found! ${matchLocation}`);

	return {
		matched: true,
		urls: removeDuplicates(results.retrieve()),
	};
};

export const processDataCode = (
	ctx: Context,
	embed: string,
	embedIndex: number,
	gameName: string,
	matches: EmbedMatch[]
): string[] => {
	const trimmedEmbed = removeAllWhitespace(embed);

	for (const matchCase of matches) {
		const testCaseResult = runMatch(
			ctx,
			trimmedEmbed,
			embedIndex,
			matchCase,
			gameName
		);

		if (testCaseResult.matched) return testCaseResult.urls ?? [];
	}

	ctx.warn(
		`Couldn't find a match on embed number ${embedIndex} on ${gameName}. Embed: ${embed}`
	);
	return [];
};
