import type { EmbedTestCase } from "../processDataCode.js";
import { url } from "../regex.js";

// currently don't know how to handle these
export const ruffle: EmbedTestCase = {
	name: "ruffle",
	testCaseSegments: [
		`<object xmlns="http://www.w3.org/1999/xhtml" 
data="`,
		[url],
		`" 
height="100%" type="application/x-shockwave-flash" width="100%"><param name="movie" value="" />
</object><script src="`,
		url,
		`"></script>`,
	],
};