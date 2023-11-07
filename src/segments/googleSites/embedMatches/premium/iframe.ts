import { regex } from "@googleSites/regex";

import type { EmbedMatch } from "@googleSites/processDataCode";

export const iframe: EmbedMatch = {
	name: "iframe",
	segments: [
		`<iframe title="`,
		regex.text,
		`" width="`,
		regex.number,
		`" height="`,
		regex.number,
		`" scrolling="no" frameborder="0" id="`,
		regex.number,
		`" name="`,
		regex.number,
		`" allowtransparency="true" class="igm" src="`,
		[regex.url],
		`"></iframe>`,
	],
};
