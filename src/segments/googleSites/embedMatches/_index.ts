
import type { EmbedMatch } from "../processDataCode";

import { premium } from "./premium/_index";
import { sixSixEz } from "./sixSixEz/_index";

import { getRegexContents } from "@utils/misc";

export const embedMatches: EmbedMatch[] = [
	sixSixEz.fr,
	sixSixEz.fullscreen,
	sixSixEz.ruffle,
	premium.ajax,
	premium.fr,
	premium.frShort,
	premium.frWrapped,
	premium.iframe,
];

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
