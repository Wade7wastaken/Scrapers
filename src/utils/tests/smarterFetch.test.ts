import { afterEach, describe, expect, it, vi } from "vitest";

import type { Result } from "neverthrow";

import { TestContext } from "@utils/context";
import { smartFetch } from "@utils/smartFetch";

const vitestUnwrap = <T, E>(r: Result<T, E>): T => {
	expect(r.isOk()).toBeTruthy();
	return r._unsafeUnwrap();
};

const vitestUnwrapErr = <T, E>(r: Result<T, E>): E => {
	expect(r.isErr()).toBeTruthy();
	return r._unsafeUnwrapErr();
};

describe("performs http requests with retries and domain throttling", () => {
	const ctx = new TestContext();

	const consoleLog = vi.spyOn(console, "log");
	const consoleWarn = vi.spyOn(console, "warn");
	const consoleError = vi.spyOn(console, "error");

	afterEach(() => {
		consoleLog.mockReset();
		consoleWarn.mockReset();
		consoleError.mockReset();
	});

	it("gets data from an api", async () => {
		expect.hasAssertions();

		const URL = "https://httpstat.us/200";
		const responseResult = await smartFetch(URL, {
			ctx,
		});

		const response = vitestUnwrap(responseResult);
		expect(response.data).toStrictEqual({ code: 200, description: "OK" });
		expect(response.status).toBe(200);

		// makes sure there were no retries
		expect(consoleLog.mock.calls).toStrictEqual([
			[`Request started: ${URL}`],
			[`Request to ${URL} succeeded`],
		]);
		expect(consoleWarn).toHaveBeenCalledTimes(0);
		expect(consoleError).toHaveBeenCalledTimes(0);
	});

	it("doesn't retry 404 errors", async () => {
		expect.hasAssertions();

		const URL = "https://httpstat.us/404";
		const responseResult = await smartFetch(URL, {
			ctx,
		});

		vitestUnwrapErr(responseResult);

		expect(consoleLog.mock.calls).toStrictEqual([
			[`Request started: ${URL}`],
		]);
		expect(consoleWarn).toHaveBeenCalledTimes(0);
		expect(consoleError.mock.calls).toStrictEqual([
			[`Unretriable error on request to ${URL}: 404`],
		]);
	});
});
