import type { EmbedTestCase } from "../googleSitesEmbeds.js";

export const testAjax: EmbedTestCase = (input) =>
	input.includes("$.ajax({") ? undefined : "";
	
	
