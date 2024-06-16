import { resultStatistics } from "../utils/resultStatistics";

import type { Context } from "../utils/logger";

export const reportStats = (ctx: Context): void => {
	for (const [site, size] of resultStatistics.entries())
		ctx.info(`${site} had ${size} entries`);
};
