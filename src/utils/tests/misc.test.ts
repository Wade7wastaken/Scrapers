import {
	capitalize,
	getRegexContents,
	lowerCaseSort,
	removeAllWhitespace,
} from "@utils/misc";
import { describe, expect, it } from "vitest";


describe("various miscellaneous functions", () => {
	it("sorts an array of games", () => {
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
		expect(capitalize("a string")).toBe("A string");
	});

	it("gets the contents of a regex", () => {
		expect(getRegexContents(/abcdefg/)).toBe("abcdefg");
	});

	it("removes all whitespace from a string", () => {
		expect(
			removeAllWhitespace(`a string    with 	a lot 
			of 			whitespace `)
		).toBe("astringwithalotofwhitespace");
	});
});
