import type { EmbedMatch } from "@googleSites/processDataCode";
import { regex } from "@googleSites/regex";

export const frShort: EmbedMatch = {
	name: "frShort",
	segments: [
		`<div id="fr" data='<iframe width="100%" height="100%" src="`,
		regex.url,
		`" frameborder="0" allowfullscreen></iframe>'></div><button class="c-button" type="button" onclick="PlayTo(this)">`,
		regex.alphaNumeric,
		`</button><style>.c-button{min-width:100%;font-family:fantasy;appearance:auto;border:0;border-color:#fff;border-radius:5px;background:#000;color:#fff;font-size:30px;cursor:pointer}.c-button:hover{background:#320d90}.c-button:focus{outline:0;box-shadow:0 0 0 4px #cbd6ee}.c-button{display:flex;align-items:center;justify-content:center;height:100%}</style><script>function PlayTo(i){var n=i.previousSibling;n.innerHTML=n.getAttribute("data"),i.style.display="none"}</script>`,
	],
};
