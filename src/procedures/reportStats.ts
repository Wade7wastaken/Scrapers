import { resultStatistics } from "../utils/resultStatistics";

import type { Logger } from "../utils/logger";

export const reportStats = (log: Logger): void => {
	for (const [site, size] of resultStatistics.entries())
		log.info(`${site} had ${size} entries`);
};
