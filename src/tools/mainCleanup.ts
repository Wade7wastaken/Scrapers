import { MainLogger } from "../utils/logger";

export const mainCleanUp = (): void => {
	// anything after this can't use the logger
	MainLogger.logFileStream.close();
};
