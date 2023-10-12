import { createWriteStream } from "node:fs";
import { inspect } from "node:util";

import { LOG_LOCATION } from "../config.js";

import { validateDirectory } from "./misc.js";

validateDirectory(LOG_LOCATION);

// Functions as a logger, but is also used as an identifier as to which site
// function a call came from using the prefix member
export class Logger {
	public readonly prefix: string;

	public static readonly allSiteNames: string[] = [];
	public static readonly logFileStream = createWriteStream(LOG_LOCATION);

	private static prepareLogLine(line: unknown): string {
		return typeof line === "string" ? line : inspect(line);
	}

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

		Logger.logFileStream.write(
			`[${logLevel.toUpperCase()}] ${
				this.prefix
			}: ${Logger.prepareLogLine(m)}\n`
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

	public static closeFileStream(): void {
		Logger.logFileStream.close();
	}
}
