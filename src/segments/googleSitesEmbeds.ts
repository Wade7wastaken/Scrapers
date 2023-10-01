import { testAjax } from "./googleSitesEmbeds/ajax.js";
import { testFr } from "./googleSitesEmbeds/fr.js";

export type EmbedTestCaseResult = (input: string) => string | undefined;

type EmbedTestCase = (string | RegExp)[];

export const parseGoogleSitesEmbeds = (embed: string): string[] => {
	// returning empty string means didn't match. returning undefined means
	// impossible to match, so stop trying

	const tests: EmbedTestCaseResult[] = [testAjax, testFr];
	const results: string[] = [];

	for (const test of tests) {
		const result = test(embed);
		if (result === undefined) break;
		if (result !== "") results.push(result);
	}

	return results;
};
