import { regex } from "@googleSites/regex";

import type { EmbedMatch } from "@googleSites/processDataCode";

export const frWrapped: EmbedMatch = {
	name: "frWrapped",
	segments: [
		`<div id="container">
<div id="fr" data='<iframe width="100%" height="100%" src="`,
		[regex.url],
		`" frameborder="0" allowfullscreen></iframe>'></div>
<button class="c-button" type="button" onclick="PlayTo(this)">`,
		regex.alphaNumeric,
		`</button>
<p id="unblocked-text">Google > Unblocked Games Premium :)</p>
</div>

`,
		regex.css,
		`

<script>
function PlayTo(button) {
  var iframe = document.getElementById("fr");
  iframe.innerHTML = iframe.getAttribute("data");
  button.style.display = "none";
}
</script>`,
	],
};
