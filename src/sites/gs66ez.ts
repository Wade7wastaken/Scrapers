import { Ok } from "@thames/monads";

import type { SiteFunction } from "@types";

import { fr } from "@googleSites/gsShared";
import {
	removeTest,
	type EmbedMatchWithTest,
} from "@googleSites/processDataCode";
import { cleanUp } from "@segments/cleanUp";
import { processGoogleSite } from "@segments/googleSites/processGoogleSite";
import { init } from "@segments/init";
import { regex } from "@utils/regex";

const IGNORED_GAMES = new Set(["All Unblocked Games 66 EZ", "Feedback"]);

export const run: SiteFunction = async () => {
	const { ctx, results } = init("UnblockedGames66");

	await processGoogleSite(
		ctx,
		results,
		"https://sites.google.com/site/unblockedgames66ez/",
		IGNORED_GAMES,
		removeTest(matches)
	);

	return Ok(cleanUp(ctx, results));
};

export const matches: EmbedMatchWithTest[] = [
	{
		embedMatch: fr,
		test: {
			data: `<div id=fr data='<iframe width="100%" height="100%" src="https://gg-opensocial.googleusercontent.com/gadgets/ifr?url=https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/1ee20621-61bc-4ec8-a8ec-5e839c2e6edc%2F1-on-1-basketball.xml" frameborder="0" allowfullscreen></iframe>'>
</div><button class="c-button" type="button" onclick="PlayTo(this)">PLAY GAME</button>
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
  sel.style.display = "none";
}
</script>`,
			result: [
				"https://gg-opensocial.googleusercontent.com/gadgets/ifr?url=https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/1ee20621-61bc-4ec8-a8ec-5e839c2e6edc%2F1-on-1-basketball.xml",
			],
		},
	},
	{
		embedMatch: {
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
		test: {
			data: `<button class="c-button">PLAY FULLSCREEN</button>
<style>
.c-button {
  min-width: 100%;
  font-family: fantasy;
  appearance: none;
  border: 0;
border-color: #fff;
  border-radius: 5px;
  background: #3d85c6;
  color: #fff;
  padding: 0px 46px;
  font-size: 20px;
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
        var urlObj = new window.URL(window.location.href);
        var url = "https://gg-opensocial.googleusercontent.com/gadgets/ifr?url=https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/1ee20621-61bc-4ec8-a8ec-5e839c2e6edc%2F1-on-1-basketball.xml";

        if (url) {
            var win;

            document.querySelector('button').onclick = function() {
                if (win) {
                    win.focus();
                } else {
                    win = window.open();
                    win.document.body.style.margin = '0';
                    win.document.body.style.height = '100vh';
                    var iframe = win.document.createElement('iframe');
                    iframe.style.border = 'none';
                    iframe.style.width = '100%';
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
			result: [
				"https://gg-opensocial.googleusercontent.com/gadgets/ifr?url=https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/1ee20621-61bc-4ec8-a8ec-5e839c2e6edc%2F1-on-1-basketball.xml",
			],
		},
	},
	{
		embedMatch: {
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
		test: {
			data: `<object xmlns="http://www.w3.org/1999/xhtml" 
data="https://cdn.jsdelivr.net/gh/UndercoverMoose/flashgames@6a11175e9c021f8359d626300aa73e16ef9c6ebd/games/sift-renegade.swf" 
height="100%" type="application/x-shockwave-flash" width="100%"><param name="movie" value="" />
</object><script src="https://cdn.jsdelivr.net/gh/h3sj7v2f6k/ruffle@e51038cf55e61bb46ea4d39ed05169ff69f8795b/ruffle.js"></script>`,
			result: [
				"https://cdn.jsdelivr.net/gh/UndercoverMoose/flashgames@6a11175e9c021f8359d626300aa73e16ef9c6ebd/games/sift-renegade.swf",
			],
		},
	},
];
