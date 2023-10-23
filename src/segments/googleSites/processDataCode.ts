import type { Logger } from "../../utils/logger.js";
import { capitalize, removeAllWhitespace } from "../../utils/misc.js";
import { ResultList } from "../../utils/resultList.js";

import { embedTestCases } from "./embedTestCases/_index.js";

// regex's that are the result of the match are an array of 1 regex
export type TestCaseSegment = string | RegExp | [RegExp];

export interface EmbedTestCase {
	name: string;
	testCaseSegments: TestCaseSegment[];
}

interface TestCaseResult {
	matched: boolean;
	urls?: string[];
}

export const runTestCase = (
	log: Logger,
	embed: string,
	embedIndex: number,
	testCase: EmbedTestCase,
	gameName: string
): TestCaseResult => {
	const matchLocation = `game: ${gameName}, embed index: ${embedIndex}, match name: ${testCase.name}`;

	const noMatch = (
		location: "string" | "regex",
		index: number
	): TestCaseResult => {
		log.info(
			`${capitalize(
				location
			)} didn't match. ${matchLocation}, segment: ${index}`
		);
		return { matched: false };
	};

	const results = new ResultList<string>(true);

	for (const [index, segment] of testCase.testCaseSegments.entries()) {
		if (typeof segment === "string") {
			const trimmedSegment = removeAllWhitespace(segment);
			if (embed.startsWith(trimmedSegment))
				embed = embed.slice(trimmedSegment.length);
			else return noMatch("string", index);

			continue;
		}
		const isOutputtedRegex = Array.isArray(segment);
		const regex = isOutputtedRegex ? segment[0] : segment;

		const execResult = regex.exec(embed);
		if (execResult === null) return noMatch("regex", index);

		const matchedString = execResult[0];
		embed = embed.slice(matchedString.length);
		if (isOutputtedRegex) results.add(matchedString);
	}

	// we haven't returned in the loop, so there is a match
	log.info(`Match found! ${matchLocation}`);

	return {
		matched: true,
		urls: results.retrieve(),
	};
};

export const processDataCode = (
	log: Logger,
	embed: string,
	embedIndex: number,
	gameName: string
): string[] => {
	const trimmedEmbed = removeAllWhitespace(embed);

	for (const testCase of embedTestCases) {
		const testCaseResult = runTestCase(
			log,
			trimmedEmbed,
			embedIndex,
			testCase,
			gameName
		);

		if (testCaseResult.matched) return testCaseResult.urls ?? [];
	}

	log.warn(
		`Couldn't find a match on embed number ${embedIndex} on ${gameName}. Embed: ${embed}`
	);
	return [];
};
