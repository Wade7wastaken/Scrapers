import { MainContext, type Context } from "../utils/context";

export const mainInit = (): Context => {
	MainContext.initLogger();
	return new MainContext("System");
};
