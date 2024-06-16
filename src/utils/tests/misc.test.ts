import { describe, expect, it } from "vitest";

import {
	capitalize,
	formatTime,
	getRegexContents,
	lowerCaseSort,
	removeAllWhitespace,
	removeDuplicates,
	smartInspect,
} from "@utils/misc";

describe("various miscellaneous functions", () => {
	// TODO: add type test for Entries<T>

	// smartInspect
	it("prints a debug view of objects or returns the same string", () => {
		expect.hasAssertions();
		expect(smartInspect("hello")).toBe("hello");
	});

	// lowerCaseSort
	it("sorts an array of games", () => {
		expect.hasAssertions();
		expect(
			[
				{ name: "def", urls: [], site: "" },
				{ name: "abc", urls: [], site: "" },
			].sort(lowerCaseSort)
		).toStrictEqual([
			{ name: "abc", urls: [], site: "" },
			{ name: "def", urls: [], site: "" },
		]);
	});

	// capitalize
	it("capitalizes the first letter of a string.", () => {
		expect.hasAssertions();
		expect(capitalize("a string")).toBe("A string");
		expect(capitalize("")).toBe("");
	});

	// getRegexContent
	it("gets the contents of a regex", () => {
		expect.hasAssertions();
		expect(getRegexContents(/abcdefg/)).toBe("abcdefg");
	});

	// removeAllWhitespace
	it("removes all whitespace from a string", () => {
		expect.hasAssertions();
		expect(
			removeAllWhitespace(`a string    with 	a lot 
			of 			whitespace `)
		).toBe("astringwithalotofwhitespace");
	});

	// removeDuplicates
	it("removes duplicates from an array", () => {
		expect.hasAssertions();
		expect(removeDuplicates([1, 2, 3, 1, 2, 3, 4])).toStrictEqual([
			1, 2, 3, 4,
		]);
	});

	// formatTime
	it("formats a given Date", () => {
		expect.hasAssertions();
		expect(formatTime(new Date(2024, 5, 16, 3, 4, 23, 345))).toBe(
			"03:04:23.345"
		);
	});
});
