import type { Logger } from "../../utils/logger.js";
import { removeAllWhitespace } from "../../utils/misc.js";
import { ResultList } from "../../utils/resultList.js";

import { embedTestCases } from "./embedTestCases/_index.js";

// regex's that are the result of the match are an array of 1 regex
export type TestCaseSegment = string | RegExp | [RegExp];

export interface EmbedTestCase {
	name: string;
	testCaseSegments: TestCaseSegment[];
}

const runTestCase = (
	log: Logger,
	embed: string,
	embedIndex: number,
	testCase: EmbedTestCase,
	gameName: string
): string[] => {
	const results = new ResultList<string>();

	for (const [index, segment] of testCase.testCaseSegments.entries()) {
		if (typeof segment === "string") {
			const trimmedSegment = removeAllWhitespace(segment);
			if (embed.startsWith(trimmedSegment))
				embed = embed.slice(trimmedSegment.length);
			else {
				log.info(
					`String didn't match. game: ${gameName}, embed index: ${embedIndex}, match name: ${testCase.name}, segment: ${index}`
				);
				return [];
			}

			continue;
		}
		const isOutputtedRegex = Array.isArray(segment);
		const regex = isOutputtedRegex ? segment[0] : segment;

		const execResult = regex.exec(embed);
		if (execResult === null) {
			log.info(
				`Regex didn't match. game: ${gameName}, embed index: ${embedIndex}, match name: ${testCase.name}, segment: ${index}`
			);
			return [];
		}

		const matchedString = execResult[0];
		embed = embed.slice(matchedString.length);
		if (isOutputtedRegex) results.add(matchedString);
	}

	// we haven't returned in the loop, so there is a match
	log.info(
		`Match found! game: ${gameName}, embed index: ${embedIndex}, match name: ${testCase.name}`
	);

	return results.retrieve();
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

		if (testCaseResult.length > 0) return testCaseResult;
	}

	log.warn(
		`Couldn't find a match on embed number ${embedIndex} on ${gameName}. Embed: ${embed}`
	);
	return [];
};
