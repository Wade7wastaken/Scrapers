import type { Logger } from "../utils/logger.js";
import { ResultList } from "../utils/resultList.js";

import { embedTestCases } from "./googleSitesEmbedsTestCases.js";

type TestCaseResult = string[] | undefined;

interface ArrayTestCase {
	testSegments: (string | RegExp)[];
	outputIndices: number[] | undefined;
}
type FunctionalTestCase = (
	log: Logger,
	gameName: string,
	embed: string
) => TestCaseResult;

export interface EmbedTestCase {
	name: string;
	test: ArrayTestCase | FunctionalTestCase;
}

const runArrayTestCase = (
	embed: string,
	arrayTestCase: ArrayTestCase
): TestCaseResult => {
	if (arrayTestCase.outputIndices === undefined) return undefined;

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
		if (arrayTestCase.outputIndices.includes(index))
			results.add(matchedString);
	}
	return results.retrieve();
};

const runFunctionalTestCase = (
	log: Logger,
	gameName: string,
	embed: string,
	functionalTestCase: FunctionalTestCase
): TestCaseResult => functionalTestCase(log, gameName, embed);

export const runEmbedTestCases = (
	log: Logger,
	gameName: string,
	embed: string
): string[] => {
	const results = new ResultList<string>();

	for (const testCase of embedTestCases) {
		const testCaseResult =
			typeof testCase.test === "function"
				? runFunctionalTestCase(log, gameName, embed, testCase.test)
				: runArrayTestCase(embed, testCase.test);

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
