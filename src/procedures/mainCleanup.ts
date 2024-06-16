import { MainContext } from "@utils/logger";

export const mainCleanUp = (): void => {
	// anything after this can't use the logger
	MainContext.logFileStream.close();
};
