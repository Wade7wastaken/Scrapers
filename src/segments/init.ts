import type { GameMap } from "@types";
import type { Context } from "@utils/logger";

import { MainContext } from "@utils/logger";

export const init = (
	loggerPrefix: string
): { ctx: Context; results: GameMap } => ({
	ctx: new MainContext(loggerPrefix),
	results: new Map<string, string[]>(),
});
