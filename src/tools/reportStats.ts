import { MainLogger } from "../utils/logger";
import { resultStatistics } from "../utils/resultStatistics";

export const reportStats = (): void => {
	const log = new MainLogger("Stats");

	for (const [site, size] of resultStatistics.entries())
		log.info(`${site} had ${size} entries`);
};
