import * as sites from "@sites";
import { TestLogger } from "@utils/logger";
import { removeAllWhitespace } from "@utils/misc";
import { describe, expect, it } from "vitest";

import {
	runMatch,
	type EmbedMatchResult,
	type EmbedMatchSegment,
} from "../processDataCode";

const testCaseWrapper = (
	embed: string,
	segments: EmbedMatchSegment[]
): EmbedMatchResult =>
	runMatch(
		new TestLogger(),
		removeAllWhitespace(embed),
		-1,
		{
			name: "Test embed case",
			segments: segments,
		},
		"Testing"
	);

describe("tests an embed against test cases", () => {
	describe("edge case behavior", () => {
		it("matches but returns nothing when the segments and embed are", () => {
			expect.hasAssertions();
			const embed = ``;
			expect(testCaseWrapper(embed, [])).toStrictEqual({
				matched: true,
				urls: [],
			});
		});

		it("doesn't match when the segments are empty and the embed isn't empty", () => {
			expect.hasAssertions();
			const embed = `abc`;
			expect(testCaseWrapper(embed, [])).toStrictEqual({
				matched: false,
			});
		});
	});

	describe.each(Object.entries(sites).filter((site) => "matches" in site[1]))(
		"matches %s cases",
		(_siteName, site) => {
			if ("matches" in site) {
				it.each(site.matches)(
					"matches $embedMatch.name",
					(siteMatch) => {
						expect.hasAssertions();
						expect(
							testCaseWrapper(
								siteMatch.test.data,
								siteMatch.embedMatch.segments
							)
						).toStrictEqual({
							matched: true,
							urls: siteMatch.test.result,
						});
					}
				);
			}
		}
	);
});
