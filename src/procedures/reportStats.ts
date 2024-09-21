import type { Context } from "@utils/context";

import { resultStatistics } from "@utils/resultStatistics";

export const reportStats = (ctx: Context): void => {
	for (const [site, size] of resultStatistics.entries())
		ctx.info(`${site} had ${size} entries`);
};
