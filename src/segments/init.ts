import type { GameMap } from "@types";
import type { Context } from "@utils/context";

import { MainContext } from "@utils/context";

export const init = (
	loggerPrefix: string
): { ctx: Context; results: GameMap } => ({
	ctx: new MainContext(loggerPrefix),
	results: new Map<string, string[]>(),
});
