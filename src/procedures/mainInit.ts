import { MainLogger } from "../utils/logger";

export const mainInit = async (): Promise<void> => {
	await MainLogger.validateLogDirectory();
};
