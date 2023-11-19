import { regex } from "@utils/regex";

import type { EmbedMatch } from "@googleSites/processDataCode";

export const frShort: EmbedMatch = {
	name: "frShort",
	segments: [
		`<div id="fr" data='<iframe width="100%" height="100%" src="`,
		[regex.url],
		`" frameborder="0" allowfullscreen></iframe>'></div><button class="c-button" type="button" onclick="PlayTo(this)">`,
		regex.alphaNumeric,
		`</button>`,
		regex.css,
		`<script>function PlayTo(i){var n=i.previousSibling;n.innerHTML=n.getAttribute("data"),i.style.display="none"}</script>`,
	],
};
