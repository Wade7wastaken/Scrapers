import { getRegexContents } from "@utils/misc.js";

import { fr } from "./66ez/fr.js";
import { fullscreen } from "./66ez/fullscreen.js";
import { ruffle } from "./66ez/ruffle.js";

import type { EmbedMatch } from "../processDataCode.js";

export const embedMatches: EmbedMatch[] = [fr, fullscreen, ruffle];

for (const testCase of embedMatches)
	for (const [index, testCaseSegment] of testCase.segments.entries())
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