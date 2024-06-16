import { describe, expect, it } from "vitest";

import { getDomain, getRetryMS } from "@utils/smartFetch";

describe("a fetch wrapper that delays between requests", () => {
	// getDomain
	it("gets the domain name from a url", () => {
		expect.hasAssertions();
		expect(getDomain("https://www.google.com")).toBe("google");
		expect(getDomain("https://abcdefg.domain.ending?search=params")).toBe(
			"domain"
		);
	});

	// getRetryMs
	it("calculates how many millis to wait before retrying a request", () => {
		expect.hasAssertions();
		expect(getRetryMS(0)).toBe(2000);
		expect(getRetryMS(1)).toBe(4000);
		expect(getRetryMS(2)).toBe(8000);
	});
});
