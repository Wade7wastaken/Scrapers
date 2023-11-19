import { regex } from "../../../../utils/regex";

import type { EmbedMatch } from "../../processDataCode";

// currently don't know how to handle these
export const ruffle: EmbedMatch = {
	name: "ruffle",
	segments: [
		`<object xmlns="http://www.w3.org/1999/xhtml" 
data="`,
		[regex.url],
		`" 
height="100%" type="application/x-shockwave-flash" width="100%"><param name="movie" value="" />
</object><script src="`,
		regex.url,
		`"></script>`,
	],
};
