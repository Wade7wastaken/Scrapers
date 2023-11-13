import { mkdir, readdir, rm } from "node:fs/promises";
import { join } from "node:path";

import { asyncIterator } from "@segments/asyncIterator";

export const validateDirectory = async (location: string): Promise<void> => {
	await mkdir(location, { recursive: true });
};

export const emptyDirectory = async (location: string): Promise<void> => {
	await asyncIterator(await readdir(location), async (item) => {
		await rm(join(location, item), {
			recursive: true,
		});
	});
};
