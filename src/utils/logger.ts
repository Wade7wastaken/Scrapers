import { createWriteStream, readdirSync, rmSync } from "node:fs";
import { inspect } from "node:util";

import { getFilename, validateDirectory, formatTime } from ".";

import type { Dirent, WriteStream } from "node:fs";

import { LOG_LOCATION } from "@config";

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

	public static logFileStream: WriteStream;

	public static readonly resultLengths = new Map<string, number>();

	private static prepareLogLine(line: unknown): string {
		return typeof line === "string" ? line : inspect(line);
	}

	public constructor(prefix: string) {
		this.prefix = prefix;
	}

	public static initLogger(): void {
		validateDirectory(LOG_LOCATION);
		const files = readdirSync(LOG_LOCATION, { withFileTypes: true })
			.filter((item) => this.shouldDeleteLogFile(item))
			.map((file) => LOG_LOCATION + "/" + file.name);

		for (const file of files) rmSync(file);

		MainLogger.logFileStream = createWriteStream(
			`${LOG_LOCATION}/${new Date().toDateString()}.log`
		);
	}

	private static shouldDeleteLogFile(item: Dirent): boolean {
		return (
			item.isFile() &&
			this.getDateDifference(getFilename(item.name)) >= 8.64e8
		);
	}

	private static getDateDifference(dateStr: string): number {
		return Date.now() - new Date(dateStr).valueOf();
	}

	private log(
		m: unknown,
		logLevel: string,
		consoleLogLevel: "log" | "warn" | "error"
	): void {
		console[consoleLogLevel](`${this.prefix}:`, m);

		MainLogger.logFileStream.write(
			`[${logLevel.toUpperCase()}] [${formatTime(new Date())}] ${
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
