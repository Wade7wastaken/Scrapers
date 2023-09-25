import type { Logger } from "../utils/logger.js";
import type { ResultList } from "../utils/resultList.js";

export const cleanUp = <T>(log: Logger, results: ResultList<T>): T[] => {
	log.info("DONE");
	return results.retrieve();
};
