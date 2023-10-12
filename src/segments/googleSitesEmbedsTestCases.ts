import type { EmbedTestCase } from "./googleSitesEmbeds.js";

const combine = (a: RegExp, b: RegExp): RegExp =>
	new RegExp(String(a).slice(1, -1) + String(b).slice(1, -1));

const url =
	/^https?:\/\/(www\.)?[\w#%+.:=@~-]{1,256}\.[\d()A-Za-z]{1,6}\b([\w#%&()+./:=?@~-]*)/;
const stopAtQuot = combine(url, /(?=&quot)/);

const alphaNumeric = /\w*/;

export const embedTestCases: EmbedTestCase[] = [
	{
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
</script>" jsaction="rcuQ6b:WYd;"><div class="EmVfjc qs41qe UzswCe" data-loadingmessage=" " jscontroller="qAKInc" jsaction="animationend:kWijWc;dyRcpb:dyRcpb" data-active="true" jsname="Hy6Uif"><div class="Cg7hO" aria-live="assertive" jsname="vyyg5"> </div><div jsname="Hxlbvc" class="xu46lf"><div class="ir3uv uWlRce co39ub"><div class="xq3j6 ERcjC"><div class="X6jHbb GOJTSe"></div></div><div class="HBnAAc"><div class="X6jHbb GOJTSe"></div></div><div class="xq3j6 dj3yTd"><div class="X6jHbb GOJTSe"></div></div></div><div class="ir3uv GFoASc Cn087"><div class="xq3j6 ERcjC"><div class="X6jHbb GOJTSe"></div></div><div class="HBnAAc"><div class="X6jHbb GOJTSe"></div></div><div class="xq3j6 dj3yTd"><div class="X6jHbb GOJTSe"></div></div></div><div class="ir3uv WpeOqd hfsr6b"><div class="xq3j6 ERcjC"><div class="X6jHbb GOJTSe"></div></div><div class="HBnAAc"><div class="X6jHbb GOJTSe"></div></div><div class="xq3j6 dj3yTd"><div class="X6jHbb GOJTSe"></div></div></div><div class="ir3uv rHV3jf EjXFBf"><div class="xq3j6 ERcjC"><div class="X6jHbb GOJTSe"></div></div><div class="HBnAAc"><div class="X6jHbb GOJTSe"></div></div><div class="xq3j6 dj3yTd"><div class="X6jHbb GOJTSe"></div></div></div></div></div><iframe jsname="WMhH6e" class=" YMEQtf" frameborder="0" sandbox="allow-scripts allow-popups allow-forms allow-same-origin allow-popups-to-escape-sandbox allow-downloads" id="`,
				alphaNumeric,
				`" name="`,
				alphaNumeric,
				`" scrolling="no" title="Custom embed" aria-label="Custom embed"></iframe></div>`,
			],
			outputIndices: [3],
		},
	},
	{
		name: "fullscreen",
		test: {
			testSegments: [
				`<div jsname="jkaScf" jscontroller="szRU7e" class="w536ob" data-enable-interaction="true" data-url="`,
				url,
				`" data-code="<button class=&quot;c-button&quot;>PLAY FULLSCREEN</button>
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
        var url = &quot;`,
				stopAtQuot,
				`&quot;;

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
    </script>" jsaction="rcuQ6b:WYd;"><div class="EmVfjc qs41qe UzswCe" data-loadingmessage=" " jscontroller="qAKInc" jsaction="animationend:kWijWc;dyRcpb:dyRcpb" data-active="true" jsname="Hy6Uif"><div class="Cg7hO" aria-live="assertive" jsname="vyyg5"> </div><div jsname="Hxlbvc" class="xu46lf"><div class="ir3uv uWlRce co39ub"><div class="xq3j6 ERcjC"><div class="X6jHbb GOJTSe"></div></div><div class="HBnAAc"><div class="X6jHbb GOJTSe"></div></div><div class="xq3j6 dj3yTd"><div class="X6jHbb GOJTSe"></div></div></div><div class="ir3uv GFoASc Cn087"><div class="xq3j6 ERcjC"><div class="X6jHbb GOJTSe"></div></div><div class="HBnAAc"><div class="X6jHbb GOJTSe"></div></div><div class="xq3j6 dj3yTd"><div class="X6jHbb GOJTSe"></div></div></div><div class="ir3uv WpeOqd hfsr6b"><div class="xq3j6 ERcjC"><div class="X6jHbb GOJTSe"></div></div><div class="HBnAAc"><div class="X6jHbb GOJTSe"></div></div><div class="xq3j6 dj3yTd"><div class="X6jHbb GOJTSe"></div></div></div><div class="ir3uv rHV3jf EjXFBf"><div class="xq3j6 ERcjC"><div class="X6jHbb GOJTSe"></div></div><div class="HBnAAc"><div class="X6jHbb GOJTSe"></div></div><div class="xq3j6 dj3yTd"><div class="X6jHbb GOJTSe"></div></div></div></div></div><iframe jsname="WMhH6e" class=" YMEQtf" frameborder="0" sandbox="allow-scripts allow-popups allow-forms allow-same-origin allow-popups-to-escape-sandbox allow-downloads" id="`,
				alphaNumeric,
				`" name="`,
				alphaNumeric,
				`" scrolling="no" title="Custom embed" aria-label="Custom embed"></iframe></div>`,
			],
			outputIndices: [1],
		},
	},
];

for (const testCase of embedTestCases) {
	if (!Array.isArray(testCase.test)) continue;
	for (const testCaseSegment of testCase.test) {
		if (
			testCaseSegment instanceof RegExp &&
			String(testCaseSegment).startsWith("^")
		)
			continue;
		throw new Error(
			`Found RegExp in test case ${
				testCase.name
			} that doesn't start with "^". RegExp is ${String(testCaseSegment)}`
		);
	}
}
