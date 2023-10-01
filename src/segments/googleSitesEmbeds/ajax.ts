import type { EmbedTestCaseResult } from "../googleSitesEmbeds.js";

export const testAjax: EmbedTestCaseResult = (input) =>
	input.includes("$.ajax({") ? undefined : "";
