import { describe, expect, it } from "vitest";

import { getDomain } from "../smartFetch.js";

describe("fetch wrappers that delay between requests", () => {
	it("gets the domain name from a url", () => {
		expect(getDomain("https://www.google.com")).toBe("google");
		expect(getDomain("https://abcdefg.domain.ending?search=params")).toBe("domain");
	});
});
