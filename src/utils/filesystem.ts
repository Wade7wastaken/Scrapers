import { mkdirSync, rmSync } from "node:fs";

export const validateDirectory = (location: string): void => {
	try {
		mkdirSync(location, { recursive: true });
	} catch (error) {
		console.error("Error validating directory:");
		console.error(error);
	}
};

// this might not be the best way to do this, but it works
export const emptyDirectory = (location: string): void => {
	try {
		rmSync(location, { recursive: true });
		mkdirSync(location);
	} catch (error) {
		console.error("Error emptying directory:");
		console.error(error);
	}
};
