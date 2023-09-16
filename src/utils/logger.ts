import { createWriteStream } from "node:fs";
import { inspect } from "node:util";

import { LOG_LOCATION } from "../config.js";

const logFileStream = createWriteStream(LOG_LOCATION);

const prepareLogLine = (line: unknown): string =>
	inspect(line).slice(1, -1) + "\n";

export const logInfo = (message: unknown): void => {
	console.log(message);
	logFileStream.write(prepareLogLine(message));
};

export const logError = (message: unknown): void => {
	console.error(message);
	logFileStream.write(prepareLogLine(message));
};

export const logger = (location: string) => {
	return (message: string) => {
		logInfo(`${location}: ${message}`);
	};
};

export const closeFileStream = (): void => {
	logFileStream.close();
};

export const gameAddLog = logger("Game Added");
