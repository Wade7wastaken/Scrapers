import { MainLogger } from "./logger";
import { resultStatistics } from "./resultStatistics";

export const reportStats = (): void => {
	const log = new MainLogger("Stats");

	for (const [site, size] of resultStatistics.entries())
		log.info(`${site} had ${size} entries`);
};
