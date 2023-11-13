import { MainLogger } from "../utils/logger";

export const mainInit = (): void => {
	MainLogger.validateLogDirectory();
};
