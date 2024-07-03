import { load } from "cheerio";
import { z } from "zod";

import type { Context } from "@utils/context";
import type { CheerioAPI } from "cheerio";
import type { ResultAsync } from "neverthrow";

import { fetchAndParse } from "@utils/smarterFetch";

export const fetchAndParseHTML = (
	ctx: Context,
	url: string
): ResultAsync<CheerioAPI, string> =>
	fetchAndParse(ctx, url, z.string()).map((str) => load(str));
