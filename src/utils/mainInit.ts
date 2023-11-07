import { MainLogger } from "./logger";

export const mainInit = (): void => {
	MainLogger.validateLogDirectory();
};
