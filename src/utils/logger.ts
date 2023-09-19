import { createWriteStream } from "node:fs";
import { inspect } from "node:util";

import { LOG_LOCATION } from "../config.js";

const logFileStream = createWriteStream(LOG_LOCATION);

const prepareLogLine = (line: unknown): string =>
	inspect(line).slice(1, -1) + "\n";

export const closeFileStream = (): void => {
	logFileStream.close();
};

export class Logger {
	private readonly prefix: string;

	public constructor(prefix: string) {
		this.prefix = prefix;
	}

	private log(m: unknown, logLevel: string): void {
		const message = `${this.prefix}: ${prepareLogLine(m)}`;
		console.log(message);
		logFileStream.write(`[${logLevel.toUpperCase()}] ${message}`);
	}

	public info(m: unknown): void {
		this.log(m, "info");
	}

	public warn(m: unknown): void {
		this.log(m, "warn");
	}

	public error(m: unknown): void {
		this.log(m, "error");
	}

	public closeFileStream(): void {
		logFileStream.close();
	}
}
