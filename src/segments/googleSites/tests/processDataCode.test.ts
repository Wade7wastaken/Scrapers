import { premium } from "@googleSites/embedMatches/premium/_index";
import { sixSixEz } from "@googleSites/embedMatches/sixSixEz/_index";
import { TestLogger } from "@utils/logger";
import { removeAllWhitespace } from "@utils/misc";
import { describe, expect, it } from "vitest";

import {
	runMatch,
	type EmbedMatchResult,
	type EmbedMatchSegment,
} from "../processDataCode";

import { premiumData, sixSixEzData } from "./processDataCode.testData";

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
		const { ajax, fr, frShort, frWrapped, iframe } = premium;

		it("matches ajax", () => {
			expect(
				testCaseWrapper(premiumData.ajax, ajax.segments)
			).toStrictEqual({
				matched: true,
				urls: [],
			});
		});

		it("matches fr", () => {
			expect(testCaseWrapper(premiumData.fr, fr.segments)).toStrictEqual({
				matched: true,
				urls: [
					"https://images-docs-opensocial.googleusercontent.com/gadgets/ifr?url=https://sites.google.com/site/drunkenduel/12minibattles.xml",
				],
			});
		});

		it("matches fr short", () => {
			expect(
				testCaseWrapper(premiumData.frShort, frShort.segments)
			).toStrictEqual({
				matched: true,
				urls: [
					"https://unblocked-games.s3.amazonaws.com/games/2022/unity3/fort-drifter/unblocked.html",
				],
			});
		});

		it("matches wrapped fr", () => {
			expect(
				testCaseWrapper(premiumData.frWrapped, frWrapped.segments)
			).toStrictEqual({
				matched: true,
				urls: [
					"https://images-opensocial.googleusercontent.com/gadgets/ifr?url=https://cdn.jsdelivr.net/gh/classroom-googl/85@main/classroombot346346.xml",
				],
			});
		});

		it("matches iframe", () => {
			expect(
				testCaseWrapper(premiumData.iframe, iframe.segments)
			).toStrictEqual({
				matched: true,
				urls: [
					"//hc8qnd0v6h8opcjc06ug6rheebqsk2me-a-sites-opensocial.googleusercontent.com/gadgets/ifr?url=https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/1ee20621-61bc-4ec8-a8ec-5e839c2e6edc%252Fcat-burglar.xml&amp;container=enterprise&amp;view=default&amp;lang=en&amp;country=ALL&amp;sanitize=0&amp;v=df2618a2c4dc688c&amp;libs=core&amp;mid=59&amp;parent=https://sites.google.com/site/unblockedgame76/cat-burglar-the-magic-museum#st=e%3DAIHE3cCbMm40CpscdcbOR%252FuV%252BJWFZpZcIqWYiTO2zEWr7o5bhi2QiruMouPqyAxymS7Z8xTAe2lLxPatWWimNeHkeq2YhSL2030WQYmeBHktuLQ4VqFwJcZySdGqkzWea5Dwek3S%252F1gT%26c%3Denterprise&amp;rpctoken=-6996335742321257804",
				],
			});
		});
	});
});
