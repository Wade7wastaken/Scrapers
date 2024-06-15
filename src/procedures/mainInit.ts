import { MainLogger, type Logger } from "../utils/logger";

export const mainInit = (): Logger => {
	MainLogger.initLogger();
	return new MainLogger("System");
};
