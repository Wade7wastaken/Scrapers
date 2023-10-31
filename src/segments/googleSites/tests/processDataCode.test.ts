import { premium } from "@googleSites/embedMatches/premium/_index.js";
import { sixSixEz } from "@googleSites/embedMatches/sixSixEz/_index.js";
import { TestLogger } from "@utils/logger.js";
import { removeAllWhitespace } from "@utils/misc.js";
import { describe, expect, it } from "vitest";

import {
	runMatch,
	type EmbedMatchResult,
	type EmbedMatchSegment,
} from "../processDataCode.js";

import { premiumData, sixSixEzData } from "./processDataCode.testData.js";

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
			const embed = ``;
			expect(testCaseWrapper(embed, [])).toStrictEqual({
				matched: true,
				urls: [],
			});
		});

		it("doesn't match when the segments are empty and the embed isn't empty", () => {
			const embed = `abc`;
			expect(testCaseWrapper(embed, [])).toStrictEqual({
				matched: false,
			});
		});
	});

	describe("matches 66ez cases", () => {
		const { fr, fullscreen, ruffle } = sixSixEz;

		it("matches fr", () => {
			expect(testCaseWrapper(sixSixEzData.fr, fr.segments)).toStrictEqual(
				{
					matched: true,
					urls: [
						"https://gg-opensocial.googleusercontent.com/gadgets/ifr?url=https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/1ee20621-61bc-4ec8-a8ec-5e839c2e6edc%2F1-on-1-basketball.xml",
					],
				}
			);
		});

		it("matches fullscreen", () => {
			expect(
				testCaseWrapper(sixSixEzData.fullscreen, fullscreen.segments)
			).toStrictEqual({
				matched: true,
				urls: [
					"https://gg-opensocial.googleusercontent.com/gadgets/ifr?url=https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/1ee20621-61bc-4ec8-a8ec-5e839c2e6edc%2F1-on-1-basketball.xml",
				],
			});
		});

		it("matches ruffle", () => {
			expect(
				testCaseWrapper(sixSixEzData.ruffle, ruffle.segments)
			).toStrictEqual({
				matched: true,
				urls: [
					"https://cdn.jsdelivr.net/gh/UndercoverMoose/flashgames@6a11175e9c021f8359d626300aa73e16ef9c6ebd/games/sift-renegade.swf",
				],
			});
		});
	});

	describe("matches premium cases", () => {
		const { fr, ajax } = premium;

		it("matches fr", () => {
			expect(testCaseWrapper(premiumData.fr, fr.segments)).toStrictEqual({
				matched: true,
				urls: [
					"https://images-docs-opensocial.googleusercontent.com/gadgets/ifr?url=https://sites.google.com/site/drunkenduel/12minibattles.xml",
				],
			});
		});

		it("matches wrapped fr", () => {
			expect(
				testCaseWrapper(premiumData.frWrapped, fr.segments)
			).toStrictEqual({
				matched: true,
				urls: [
					"https://images-opensocial.googleusercontent.com/gadgets/ifr?url=https://cdn.jsdelivr.net/gh/classroom-googl/85@main/classroombot346346.xml",
				],
			});
		});

		it("matches ajax", () => {
			expect(
				testCaseWrapper(premiumData.ajax, ajax.segments)
			).toStrictEqual({
				matched: true,
				urls: [],
			});
		});
	});
});
