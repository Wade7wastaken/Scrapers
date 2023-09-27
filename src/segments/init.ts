import { Logger } from "../utils/logger.js";

export const init = (
	loggerPrefix: string
): { log: Logger; results: Map<string, string> } => ({
	log: new Logger(loggerPrefix),
	results: new Map<string, string>(),
});
