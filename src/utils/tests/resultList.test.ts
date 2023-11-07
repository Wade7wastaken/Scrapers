import { describe, expect, it } from "vitest";

import { ResultList } from "@utils/resultList";

describe("an array wrapper class", () => {
	it("adds elements one at a time", () => {
		const results = new ResultList<string>();
		results.add("hello");
		results.add("world");
		expect(results.retrieve()).toStrictEqual(["hello", "world"]);
		expect(results.length()).toBe(2);
	});

	it("adds multiple elements", () => {
		const results = new ResultList<string>();
		results.add("hello", "world");
		expect(results.retrieve()).toStrictEqual(["hello", "world"]);
		expect(results.length()).toBe(2);
	});

	it("adds elements with the spread operator", () => {
		const results = new ResultList<string>();
		// eslint-disable-next-line unicorn/no-useless-spread
		results.add(...["hello", "world"]);
		expect(results.retrieve()).toStrictEqual(["hello", "world"]);
		expect(results.length()).toBe(2);
	});

	it("can avoid duplicates", () => {
		const results = new ResultList<string>(true);
		results.add("hello", "world", "hello");
		expect(results.retrieve()).toStrictEqual(["hello", "world"]);
		expect(results.length()).toBe(2);
	});
});
