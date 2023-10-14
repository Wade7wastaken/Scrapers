import type { Logger } from "../../utils/logger.js";
import { ResultList } from "../../utils/resultList.js";

import { tests } from "./tests/index.js";

// the possible values returned by a test case. Array includes matched links.
// Empty array means didn't match, undefined means stop looking
export type TestCaseResult = string[] | undefined;

export type ArrayTestCaseSegment = string | RegExp;

// A test case for an array
export interface ArrayTestCase {
	testSegments: ArrayTestCaseSegment[];
	outputIndices: number[] | undefined;
}

export type FunctionalTestCase = (
	log: Logger,
	gameName: string,
	embed: string
) => TestCaseResult;

export interface EmbedTestCase {
	name: string;
	test: ArrayTestCase | FunctionalTestCase;
}

const runArrayTestCase = (
	log: Logger,
	embed: string,
	arrayTestCase: ArrayTestCase,
	testName: string,
	gameName: string
): TestCaseResult => {
	const results = new ResultList<string>();

	for (const [index, segment] of arrayTestCase.testSegments.entries()) {
		if (typeof segment === "string") {
			if (embed.startsWith(segment)) embed = embed.slice(segment.length);
			else return [];

			continue;
		}

		const regexResult = segment.exec(embed);

		if (regexResult === null) return [];

		const matchedString = regexResult[0];
		embed = embed.slice(matchedString.length);
		if (arrayTestCase.outputIndices?.includes(index))
			results.add(matchedString);
	}

	// we haven't returned in the loop, so there is a match
	log.info(`Match found! Game name: ${gameName}, match name: ${testName}`);

	if (arrayTestCase.outputIndices === undefined) return undefined;

	return results.retrieve();
};

const runFunctionalTestCase = (
	log: Logger,
	gameName: string,
	embed: string,
	functionalTestCase: FunctionalTestCase
): TestCaseResult => functionalTestCase(log, gameName, embed);

export const processEmbed = (
	log: Logger,
	gameName: string, // used for error messages
	embed: string
): string[] => {
	const results = new ResultList<string>();

	for (const testCase of tests) {
		const testCaseResult =
			typeof testCase.test === "function"
				? runFunctionalTestCase(log, gameName, embed, testCase.test)
				: runArrayTestCase(
						log,
						embed,
						testCase.test,
						testCase.name,
						gameName
				  );

		if (testCaseResult === undefined) {
			log.info(
				`Giving up on embeds on ${gameName} because ${testCase.name} returned undefined`
			);
			return [];
		}

		results.add(...testCaseResult);
	}

	if (results.length() === 0) {
		log.warn(
			`Couldn't find a match for an embed on ${gameName}. Embed: ${embed}`
		);
	}

	return results.retrieve();
};
