import { MainContext, type Context } from "../utils/logger";

export const mainInit = (): Context => {
	MainContext.initLogger();
	return new MainContext("System");
};
