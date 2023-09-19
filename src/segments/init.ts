import type { Game } from "../types.js";
import { Logger } from "../utils/logger.js";
import { ResultList } from "../utils/resultList.js";

export const init = (
	loggerPrefix: string
): { log: Logger; results: ResultList<Game> } => ({
	log: new Logger(loggerPrefix),
	results: new ResultList<Game>(),
});
