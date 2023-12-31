import { createWriteStream } from "node:fs";
import { dirname } from "node:path";
import { inspect } from "node:util";

import { LOG_LOCATION } from "@config";

import { emptyDirectory, validateDirectory } from "./filesystem";

export type Logger = {
	prefix: string;
	info(m: unknown): void;
	warn(m: unknown): void;
	error(m: unknown): void;
	setResultsLength(length: number): void;
};

// Functions as a logger, but is also used as an identifier as to which site
// function a call came from using the prefix member
export class MainLogger implements Logger {
	public readonly prefix: string;

	public static readonly allSiteNames: string[] = [];
	public static readonly logFileStream = createWriteStream(LOG_LOCATION);

	public static readonly resultLengths = new Map<string, number>();

	private static prepareLogLine(line: unknown): string {
		return typeof line === "string" ? line : inspect(line);
	}

	public constructor(prefix: string) {
		this.prefix = prefix;
		MainLogger.allSiteNames.push(prefix);
	}

	private log(
		m: unknown,
		logLevel: string,
		consoleLogLevel: "log" | "warn" | "error"
	): void {
		console[consoleLogLevel](`${this.prefix}:`, m);

		MainLogger.logFileStream.write(
			`[${logLevel.toUpperCase()}] ${
				this.prefix
			}: ${MainLogger.prepareLogLine(m)}\n`
		);
	}

	public info(m: unknown): void {
		this.log(m, "info", "log");
	}

	public warn(m: unknown): void {
		this.log(m, "warn", "warn");
	}

	public error(m: unknown): void {
		this.log(m, "error", "error");
	}

	public setResultsLength(length: number): void {
		MainLogger.resultLengths.set(this.prefix, length);
	}

	public static closeFileStream(): void {
		MainLogger.logFileStream.close();
	}

	public static async validateLogDirectory(): Promise<void> {
		const dirName = dirname(LOG_LOCATION);
		await validateDirectory(dirName);
		await emptyDirectory(dirName);
	}
}

export class TestLogger implements Logger {
	public prefix = "Test Logger";

	public info(m: unknown): void {
		console.log(m);
	}

	public warn(m: unknown): void {
		console.log(m);
	}

	public error(m: unknown): void {
		console.log(m);
	}

	public setResultsLength(length: number): void {
		console.log(`Test Logger was set with result length of ${length}`);
	}
}
