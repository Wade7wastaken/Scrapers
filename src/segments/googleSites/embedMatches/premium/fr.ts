import { regex } from "@googleSites/regex";

import type { EmbedMatch } from "@googleSites/processDataCode";

export const fr: EmbedMatch = {
	name: "fr",
	segments: [
		`<div id=fr data='<iframe width="100%" height="100%" src="`,
		[regex.url],
		`" frameborder="0" allowfullscreen></iframe>'>
</div><button class="c-button" type="button" onclick="PlayTo(this)">`,
		regex.alphaNumeric,
		`</button>

<style>
.c-button {
  min-width: 100%;
  font-family: inherit;
  appearance: none;
  border: 0;
  border-radius: 5px;
  background: #2c2c2c;
  color: #fff;
  padding: 18px 46px;
  font-size: 28px;
  cursor: pointer;
}

.c-button:hover {
  background: #3f3f3f;
}

.c-button:focus {
  outline: none;
  box-shadow: 0 0 0 4px #cbd6ee;
}
  
 .c-button {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
}

</style>

<script>
function PlayTo(sel){
  var div = sel.previousSibling;
  div.innerHTML=div.getAttribute('data');
  sel.style.display = "none";
}
</script>`,
	],
};
