import type { CheerioAPI } from "cheerio";
import { load } from "cheerio";

import type { Logger } from "../utils/logger.js";
import { smartFetch } from "../utils/smartFetch.js";

export const fetchAndParse = async (
	log: Logger,
	url: string
): Promise<CheerioAPI | undefined> => {
	const response = await smartFetch<string>(log, url);
	if (response === undefined) return;
	const $ = load(response);
	return $;
};
