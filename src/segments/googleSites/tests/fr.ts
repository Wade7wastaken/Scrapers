import { stopAtQuot, url } from "../regex.js";
import type { EmbedTestCase } from "../testEmbed.js";

import { ending } from "./segments/ending.js";

export const fr: EmbedTestCase = {
	name: "fr",
	test: {
		testSegments: [
			`<div jsname="jkaScf" jscontroller="szRU7e" class="w536ob" data-enable-interaction="true" data-url="`,
			url,
			`" data-code="<div id=fr data='<iframe width=&quot;100%&quot; height=&quot;100%&quot; src=&quot;`,
			stopAtQuot,
			`&quot; frameborder=&quot;0&quot; allowfullscreen></iframe>'>
</div><button class=&quot;c-button&quot; type=&quot;button&quot; onclick=&quot;PlayTo(this)&quot;>PLAY GAME</button>
<style>
.c-button {
  min-width: 100%;
  font-family: fantasy;
  appearance: auto;
  border: 0;
  border-color: #fff;
  border-radius: 5px;
  background: #3d85c6;
  color: #fff;

  font-size: 30px;
  cursor: pointer;
}

.c-button:hover {
  background: #0b5394;
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
  sel.style.display = &quot;none&quot;;
}
`,
			...ending,
		],
		outputIndices: [3],
	},
};