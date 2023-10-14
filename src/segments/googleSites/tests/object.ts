import { stopAtQuot, url } from "../regex.js";
import type { EmbedTestCase } from "../testEmbed.js";

import { ending } from "./segments/ending.js";

export const object: EmbedTestCase = {
	name: "object",
	test: {
		testSegments: [
			`<div jsname="jkaScf" jscontroller="szRU7e" class="w536ob" data-enable-interaction="true" data-url="`,
			url,
			`" data-code="<object xmlns=&quot;http://www.w3.org/1999/xhtml&quot; 
data=&quot;`,
			stopAtQuot,
			`&quot; 
height=&quot;100%&quot; type=&quot;application/x-shockwave-flash&quot; width=&quot;100%&quot;><param name=&quot;movie&quot; value=&quot;&quot; />
</object><script src=&quot;https://cdn.jsdelivr.net/gh/h3sj7v2f6k/ruffle@e51038cf55e61bb46ea4d39ed05169ff69f8795b/ruffle.js&quot;>`,
			...ending,
		],
		outputIndices: undefined,
	},
};
