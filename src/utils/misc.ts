import { inspect } from "node:util";

import { err, ok, type Result } from "neverthrow";

import type { z, ZodSchema } from "zod";

// one liner function that could be used anywhere

export const smartInspect = (data: unknown): string =>
	typeof data === "string" ? data : inspect(data);

export const sleep = (ms: number): Promise<void> =>
	new Promise((r) => setTimeout(r, ms));

export const capitalize = (s: string): string => {
	const firstChar = s[0];
	return firstChar === undefined ? "" : firstChar.toUpperCase() + s.slice(1);
};

export const getRegexContents = (regex: RegExp): string =>
	String(regex).slice(1, -1);

export const removeAllWhitespace = (input: string): string =>
	input.replaceAll(/\s+/g, "");

// not public because it doesn't handle negative numbers well
const padNumber = (time: number, len = 2): string =>
	time.toString().padStart(len, "0");

export const formatTime = (now: Date): string =>
	`${padNumber(now.getHours())}:${padNumber(now.getMinutes())}:${padNumber(
		now.getSeconds()
	)}.${padNumber(now.getMilliseconds(), 3)}`;

export const safeParseResult = <T extends ZodSchema>(
	expectedType: T,
	data: unknown
): Result<z.infer<T>, string> => {
	const parseResult = expectedType.safeParse(data);
	return parseResult.success
		? ok(parseResult.data)
		: err(parseResult.error.format()._errors.join("\r\n"));
};
