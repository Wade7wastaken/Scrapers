import { cleanUp } from "@segments/cleanUp";
import { processGoogleSite } from "@segments/googleSites/processGoogleSite";
import { init } from "@segments/init";
import { regex } from "@utils/regex";

import type { EmbedMatch } from "@googleSites/processDataCode";
import type { SiteFunction } from "@types";

const IGNORED_GAMES = new Set(["All Unblocked Games 66 EZ", "Feedback"]);

export const run: SiteFunction = async () => {
	const { log, results } = init("UnblockedGames66");

	await processGoogleSite(
		log,
		results,
		"https://sites.google.com/site/unblockedgames66ez/",
		IGNORED_GAMES,
		matches
	);

	return cleanUp(log, results);
};

const matches: EmbedMatch[] = [
	{
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
	},
	{
		name: "fullscreen",
		segments: [
			`<button class="c-button">`,
			regex.text,
			`</button>
`,
			regex.css,
			`

<script>
var urlObj = new window.URL(window.location.href);
var url = "`,
			[regex.url],
			`";

if (url) {
	var win;

	document.querySelector('button').onclick = function() {
		if (win) {
			win.focus();
		} else {
			win = window.open();
			win.document.body.style.margin = '0`,
			/^( \d+%)?/,
			`';
			win.document.body.style.height = '100vh';
			var iframe = win.document.createElement('iframe');
			iframe.style.border = 'none';
			iframe.style.width = '`,
			regex.number,
			`%';
			iframe.style.height = '100%';
			iframe.style.margin = '0';
			iframe.src = url;
			win.document.body.appendChild(iframe);
			

			var interval = setInterval(function() {
				if (win.closed) {
					clearInterval(interval);
					win = undefined;

				}
			}, 500);


		}
	};
}
</script>`,
		],
	},
	{
		name: "ruffle",
		segments: [
			`<object xmlns="http://www.w3.org/1999/xhtml" 
data="`,
			[regex.url],
			`" 
height="100%" type="application/x-shockwave-flash" width="100%"><param name="movie" value="" />
</object><script src="`,
			regex.url,
			`"></script>`,
		],
	},
];
