import { MainContext } from "@utils/context";

export const mainCleanUp = (): void => {
	// anything after this can't use the logger
	MainContext.closeFileStream();
};
