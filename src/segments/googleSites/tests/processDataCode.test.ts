import { TestLogger } from "@utils/logger.js";
import { removeAllWhitespace } from "@utils/misc.js";
import { describe, expect, it } from "vitest";

import { fr } from "../embedTestCases/66ez/fr.js";
import { fullscreen } from "../embedTestCases/66ez/fullscreen.js";
import { ruffle } from "../embedTestCases/66ez/ruffle.js";
import { ajax } from "../embedTestCases/premium/ajax.js";
import {
	runTestCase,
	type TestCaseResult,
	type TestCaseSegment,
} from "../processDataCode.js";

import {
	ajaxEmbed,
	frEmbed,
	fullscreenEmbed,
	premiumFrEmbed,
	premiumWrappedFrEmbed,
	ruffleEmbed,
} from "./processDataCode.testData.js";

const testCaseWrapper = (
	embed: string,
	segments: TestCaseSegment[]
): TestCaseResult =>
	runTestCase(
		new TestLogger(),
		removeAllWhitespace(embed),
		-1,
		{
			name: "Test embed case",
			testCaseSegments: segments,
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
		it("matches fr", () => {
			expect(testCaseWrapper(frEmbed, fr.testCaseSegments)).toStrictEqual(
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
				testCaseWrapper(fullscreenEmbed, fullscreen.testCaseSegments)
			).toStrictEqual({
				matched: true,
				urls: [
					"https://gg-opensocial.googleusercontent.com/gadgets/ifr?url=https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/1ee20621-61bc-4ec8-a8ec-5e839c2e6edc%2F1-on-1-basketball.xml",
				],
			});
		});

		it("matches ruffle", () => {
			expect(
				testCaseWrapper(ruffleEmbed, ruffle.testCaseSegments)
			).toStrictEqual({
				matched: true,
				urls: [
					"https://cdn.jsdelivr.net/gh/UndercoverMoose/flashgames@6a11175e9c021f8359d626300aa73e16ef9c6ebd/games/sift-renegade.swf",
				],
			});
		});
	});

	describe("matches premium cases", () => {
		it("matches premium fr", () => {
			expect(
				testCaseWrapper(premiumFrEmbed, fr.testCaseSegments)
			).toStrictEqual({
				matched: true,
				urls: [
					"https://images-docs-opensocial.googleusercontent.com/gadgets/ifr?url=https://sites.google.com/site/drunkenduel/12minibattles.xml",
				],
			});
		});

		it("matches premium ajax", () => {
			expect(
				testCaseWrapper(ajaxEmbed, ajax.testCaseSegments)
			).toStrictEqual({
				matched: true,
				urls: [],
			});
		});

		it("matches wrapped premium fr", () => {
			expect(
				testCaseWrapper(premiumWrappedFrEmbed, fr.testCaseSegments)
			).toStrictEqual({
				matched: true,
				urls: [
					"https://images-opensocial.googleusercontent.com/gadgets/ifr?url=https://cdn.jsdelivr.net/gh/classroom-googl/85@main/classroombot346346.xml",
				],
			});
		});
	});
});
