import { getRegexContents } from "@utils/misc.js";

import type { EmbedTestCase } from "../processDataCode.js";

import { fr } from "./fr.js";
import { fullscreen } from "./fullscreen.js";
import { ruffle } from "./ruffle.js";

export const embedTestCases: EmbedTestCase[] = [fr, fullscreen, ruffle];

for (const testCase of embedTestCases)
	for (const [index, testCaseSegment] of testCase.testCaseSegments.entries())
		if (
			testCaseSegment instanceof RegExp &&
			!getRegexContents(testCaseSegment).startsWith("^")
		)
			throw new Error(
				`Found regex in test case ${
					testCase.name
				} at index ${index} that doesn't start with "^". RegExp is ${getRegexContents(
					testCaseSegment
				)}`
			);
