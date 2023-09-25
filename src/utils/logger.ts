import { createWriteStream } from "node:fs";
import { inspect } from "node:util";

import { LOG_LOCATION } from "../config.js";

import { validateDirectory } from "./misc.js";

validateDirectory(LOG_LOCATION);
const logFileStream = createWriteStream(LOG_LOCATION);

const prepareLogLine = (line: unknown): string =>
	typeof line === "string" ? line : inspect(line);

export const closeFileStream = (): void => {
	logFileStream.close();
};

// Functions as a logger, but is also used as an identifier as to which site
// function a call came from using the prefix member
export class Logger {
	public readonly prefix: string;

	public static readonly allSiteNames: string[] = [];

	public constructor(prefix: string) {
		this.prefix = prefix;
		Logger.allSiteNames.push(prefix);
	}

	private log(
		m: unknown,
		logLevel: string,
		consoleLogLevel: "log" | "warn" | "error"
	): void {
		console[consoleLogLevel](`${this.prefix}:`, m);

		logFileStream.write(
			`[${logLevel.toUpperCase()}] ${this.prefix}: ${prepareLogLine(m)}\n`
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
}
