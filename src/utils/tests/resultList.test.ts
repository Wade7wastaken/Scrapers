import { describe, expect, it } from "vitest";

import { ResultList } from "@utils/resultList";

describe("an array wrapper class", () => {
	it("adds elements one at a time", () => {
		expect.hasAssertions();
		const results = new ResultList<string>();
		results.add("hello");
		results.add("world");
		expect(results.retrieve()).toStrictEqual(["hello", "world"]);
		expect(results.length()).toBe(2);
	});

	it("adds multiple elements", () => {
		expect.hasAssertions();
		const results = new ResultList<string>();
		results.add("hello", "world");
		expect(results.retrieve()).toStrictEqual(["hello", "world"]);
		expect(results.length()).toBe(2);
	});

	it("adds elements with the spread operator", () => {
		expect.hasAssertions();
		const results = new ResultList<string>();
		const resultToAdd = ["hello", "world"];
		results.add(...resultToAdd);
		expect(results.retrieve()).toStrictEqual(["hello", "world"]);
		expect(results.length()).toBe(2);
	});

	it("can avoid duplicates", () => {
		expect.hasAssertions();
		const results = new ResultList<string>(true);
		results.add("hello", "world", "hello");
		expect(results.retrieve()).toStrictEqual(["hello", "world"]);
		expect(results.length()).toBe(2);
	});
});
