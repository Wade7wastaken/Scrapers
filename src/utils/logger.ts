import { createWriteStream } from "node:fs";

import { formatTime, smartInspect } from ".";

import type { WriteStream } from "node:fs";

import { LOG_LOCATION } from "@config";

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export interface Context {
	name: string;
	info(m: unknown): void;
	warn(m: unknown): void;
	error(m: unknown): void;
	setResultsLength(length: number): void;
}

// Functions as a logger, but is also used as an identifier as to which site
// function a call came from using the prefix member
export class MainContext implements Context {
	public static logFileStream: WriteStream;

	public static readonly resultLengths = new Map<string, number>();

	public constructor(public readonly name: string) {}

	public static initLogger(): void {
		MainContext.logFileStream = createWriteStream(
			`${LOG_LOCATION}/${new Date().toLocaleString()}.log`
		);
	}

	private log(
		m: unknown,
		logLevel: string,
		consoleLogLevel: "log" | "warn" | "error"
	): void {
		console[consoleLogLevel](`${this.name}:`, m);

		MainContext.logFileStream.write(
			`[${logLevel.toUpperCase()}] [${formatTime(new Date())}] ${
				this.name
			}: ${smartInspect(m)}\n`
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
		MainContext.resultLengths.set(this.name, length);
	}

	public static closeFileStream(): void {
		MainContext.logFileStream.close();
	}
}

export class TestContext implements Context {
	public name = "Test Logger";

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
