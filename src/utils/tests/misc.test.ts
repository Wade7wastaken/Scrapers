import { describe, expect, it } from "vitest";

import {
	capitalize,
	getRegexContents,
	lowerCaseSort,
	removeAllWhitespace,
} from "@utils/misc";

describe("various miscellaneous functions", () => {
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

	it("capitalizes the first letter of a string.", () => {
		expect.hasAssertions();
		expect(capitalize("a string")).toBe("A string");
	});

	it("gets the contents of a regex", () => {
		expect.hasAssertions();
		expect(getRegexContents(/abcdefg/)).toBe("abcdefg");
	});

	it("removes all whitespace from a string", () => {
		expect.hasAssertions();
		expect(
			removeAllWhitespace(`a string    with 	a lot 
			of 			whitespace `)
		).toBe("astringwithalotofwhitespace");
	});
});
