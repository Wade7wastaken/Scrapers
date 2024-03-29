import type { EmbedMatch } from "./processDataCode";

import { regex } from "@utils/regex";

export const fr: EmbedMatch = {
	name: "fr",
	segments: [
		`<div id=fr data='<iframe width="100%" height="100%" src="`,
		[regex.url],
		`" frameborder="0" allowfullscreen></iframe>'>
</div><button class="c-button" type="button" onclick="PlayTo(this)">`,
		regex.alphaNumeric,
		`</button>`,
		regex.css,
		`
<script>
function PlayTo(sel){
var div = sel.previousSibling;
div.innerHTML=div.getAttribute('data');
sel.style.display = "none";
}
</script>`,
	],
};
