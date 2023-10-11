import type { EmbedTestCase } from "./googleSitesEmbeds.js";

const regexps = {
	url: /^https?:\/\/(www\.)?[\w#%+.:=@~-]{1,256}\.[\d()A-Za-z]{1,6}\b([\w#%&()+./:=?@~-]*)/,
};

export const embedTestCases: EmbedTestCase[] = [
	{
		name: "fr",
		test: {
			testSegments: [
				`<div jsname="jkaScf" jscontroller="szRU7e" class="w536ob" data-enable-interaction="true" data-url="`,
				regexps.url,
				`" data-code="<div id=fr data='<iframe width=&quot;100%&quot; height=&quot;100%&quot; src=&quot;https://gg-opensocial.googleusercontent.com/gadgets/ifr?url=https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/1ee20621-61bc-4ec8-a8ec-5e839c2e6edc%2F1-on-1-basketball.xml&quot; frameborder=&quot;0&quot; allowfullscreen></iframe>'>
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
</script>" jsaction="rcuQ6b:WYd;"><div class="EmVfjc qs41qe UzswCe" data-loadingmessage=" " jscontroller="qAKInc" jsaction="animationend:kWijWc;dyRcpb:dyRcpb" data-active="true" jsname="Hy6Uif"><div class="Cg7hO" aria-live="assertive" jsname="vyyg5"> </div><div jsname="Hxlbvc" class="xu46lf"><div class="ir3uv uWlRce co39ub"><div class="xq3j6 ERcjC"><div class="X6jHbb GOJTSe"></div></div><div class="HBnAAc"><div class="X6jHbb GOJTSe"></div></div><div class="xq3j6 dj3yTd"><div class="X6jHbb GOJTSe"></div></div></div><div class="ir3uv GFoASc Cn087"><div class="xq3j6 ERcjC"><div class="X6jHbb GOJTSe"></div></div><div class="HBnAAc"><div class="X6jHbb GOJTSe"></div></div><div class="xq3j6 dj3yTd"><div class="X6jHbb GOJTSe"></div></div></div><div class="ir3uv WpeOqd hfsr6b"><div class="xq3j6 ERcjC"><div class="X6jHbb GOJTSe"></div></div><div class="HBnAAc"><div class="X6jHbb GOJTSe"></div></div><div class="xq3j6 dj3yTd"><div class="X6jHbb GOJTSe"></div></div></div><div class="ir3uv rHV3jf EjXFBf"><div class="xq3j6 ERcjC"><div class="X6jHbb GOJTSe"></div></div><div class="HBnAAc"><div class="X6jHbb GOJTSe"></div></div><div class="xq3j6 dj3yTd"><div class="X6jHbb GOJTSe"></div></div></div></div></div><iframe jsname="WMhH6e" class=" YMEQtf" frameborder="0" sandbox="allow-scripts allow-popups allow-forms allow-same-origin allow-popups-to-escape-sandbox allow-downloads" id="147065676b070aff_364" name="147065676b070aff_364" scrolling="no" title="Custom embed" aria-label="Custom embed"></iframe></div>`,
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
