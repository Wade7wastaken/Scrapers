import { alphaNumeric, url } from "../regex.js";
import type { EmbedTestCase } from "../testEmbed.js";

export const dataUrl: EmbedTestCase = {
	name: "dataUrl",
	test: {
		testSegments: [
			`<div jsname="jkaScf" data-url="`,
			url,
			`" jscontroller="N0NZx" class="w536ob" jsaction="rcuQ6b:WYd;" aria-label="Whole page embed"><iframe jsname="WMhH6e" src="`,
			url,
			`" class=" YMEQtf" frameborder="0" sandbox="allow-scripts allow-popups allow-forms allow-same-origin allow-popups-to-escape-sandbox allow-downloads" id="`,
			alphaNumeric,
			`" name="`,
			alphaNumeric,
			`" scrolling="no"></iframe></div>`,
		],
		outputIndices: [],
	},
};
