import { getRegexContents } from "../../../utils/misc.js";
import type { EmbedTestCase } from "../testEmbed.js";

import { dataUrl } from "./dataUrl.js";
import { fr } from "./fr.js";
import { fullscreen } from "./fullscreen.js";
import { object } from "./object.js";

export const tests: EmbedTestCase[] = [fr, fullscreen, object, dataUrl];

for (const testCase of tests) {
	if (typeof testCase.test === "function") continue;
	for (const testCaseSegment of testCase.test.testSegments) {
		if (
			testCaseSegment instanceof RegExp &&
			!getRegexContents(testCaseSegment).startsWith("^")
		)
			throw new Error(
				`Found RegExp in test case ${
					testCase.name
				} that doesn't start with "^". RegExp is ${getRegexContents(
					testCaseSegment
				)}`
			);
	}
}
