import { load } from "cheerio";

import type { EmbedTestCase } from "../googleSitesEmbeds.js";

export const testFr: EmbedTestCase = (input) => {
	const $ = load(input);

	// should add some error reporting here but id have to pass log all the way down here
	const fr = $("#fr");
	if (fr.length === 0) return "";

	const data = fr.attr("data");
	if (data === undefined) return "";

	const $2 = load(data);

	const iframe = $2("iframe");
	if (iframe.length === 0) return "";

	const src = iframe.attr("src");
	if (src === undefined) return "";

	return src;
};
