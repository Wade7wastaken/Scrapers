import { smartFetch } from "@utils/smartFetch";
import { load } from "cheerio";
import { z } from "zod";

import type { Logger } from "@utils/logger";
import type { CheerioAPI } from "cheerio";

export const fetchAndParse = async (
	log: Logger,
	url: string
): Promise<CheerioAPI | undefined> => {
	const response = await smartFetch<unknown>(log, url);
	if (response === undefined) return undefined;

	const parsed = z.string().parse(response);

	const $ = load(parsed);
	return $;
};
