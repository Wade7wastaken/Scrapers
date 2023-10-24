import { alphaNumeric, url } from "../regex.js";

import type { EmbedTestCase } from "../processDataCode.js";

export const fr: EmbedTestCase = {
	name: "fr",
	testCaseSegments: [
		// these might be other values
		/^(<divid="container">)?/,
		`<div id=`,
		/^"?/,
		`fr`,
		/^"?/,
		` data='<iframe width="100%" height="100%" src="`,
		[url],
		`" frameborder="0" allowfullscreen></iframe>'>
</div><button class="c-button" type="button" onclick="PlayTo(this)">`,
		alphaNumeric,
		`</button>
`, // there are so many possible styles that it just makes sense to capture all of them
		/^<style>.*<\/style>/,
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
