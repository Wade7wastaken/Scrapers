import { Ok, type Result } from "@thames/monads";
import { load } from "cheerio";
import { z } from "zod";

import type { Context } from "@utils/logger";
import type { CheerioAPI } from "cheerio";

import { smartFetch } from "@utils/smartFetch";

export const fetchAndParse = async (
	ctx: Context,
	url: string
): Promise<Result<CheerioAPI, string>> => {
	const fetchResult = await smartFetch(ctx, url, z.string());
	// im pretty sure cheerio.load doesn't throw anything
	return fetchResult.andThen((page) => Ok(load(page)));
};
