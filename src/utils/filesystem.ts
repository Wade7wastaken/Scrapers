import { access, mkdir, readdir, rm } from "node:fs/promises";
import { join } from "node:path";

import { asyncIterator } from "@segments/asyncIterator";

export const fileExists = async (path: string): Promise<boolean> =>
	// this syntax is weird but it does what you expect
	await access(path)
		.then(() => true)
		.catch(() => false);

export const validateDirectory = async (location: string): Promise<void> => {
	try {
		await mkdir(location, { recursive: true });
	} catch (error) {
		console.error("Error validating directory:");
		console.error(error);
	}
};

export const emptyDirectory = async (location: string): Promise<void> => {
	try {
		await asyncIterator(await readdir(location), async (item) => {
			await rm(join(location, item), {
				recursive: true,
			});
		});
	} catch (error) {
		console.error("Error emptying directory:");
		console.error(error);
	}
};
