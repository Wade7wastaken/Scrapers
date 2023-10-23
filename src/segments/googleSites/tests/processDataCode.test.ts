import { describe, expect, it } from "vitest";

import { TestLogger } from "../../../utils/logger.js";
import { runTestCase } from "../processDataCode.js";

describe("tests an embed against test cases", () => {
	it("tests a given data-code embed", () => {
		const log = new TestLogger();

        const embed = `abc`;

		expect(
			runTestCase(
				log,
				embed,
				-1,
				{
					name: "Test embed case",
					testCaseSegments: [],
				},
				"Testing"
			)
		).toStrictEqual({
            matched: true,
            urls: []
        });
	});
});
