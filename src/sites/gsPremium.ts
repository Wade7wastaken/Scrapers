import {
	removeTest,
	type EmbedMatchWithTest,
} from "@googleSites/processDataCode";
import { cleanUp } from "@segments/cleanUp";
import { processGoogleSite } from "@segments/googleSites/processGoogleSite";
import { init } from "@segments/init";
import { regex } from "@utils/regex";

import type { SiteFunction } from "@types";

const IGNORED_GAMES = new Set([
	"home",
	"Flash Games",
	"Driving Games",
	"2 Player Games",
	"Fun Games",
	"Best Games",
	"Contact",
	"Send Game!",
	"Game is Not Loading!",
	"Copyright",
]);

export const run: SiteFunction = async () => {
	const { log, results } = init("Unblocked Premium");

	await processGoogleSite(
		log,
		results,
		"https://sites.google.com/view/games-unblockedd/",
		IGNORED_GAMES,
		removeTest(matches)
	);

	return cleanUp(log, results);
};

export const matches: EmbedMatchWithTest[] = [
	{
		embedMatch: {
			name: "fr",
			segments: [
				`<div id=`,
				/^"?/,
				`fr`,
				/^"?/,
				` data='<iframe width="100%" height="100%" src="`,
				[regex.url],
				`" frameborder="0" allowfullscreen></iframe>'>
</div><button class="c-button" type="button" onclick="PlayTo(this)">`,
				regex.alphaNumeric,
				`</button>

`,
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
		test: {
			data: `<div id=fr data='<iframe width="100%" height="100%" src="https://images-docs-opensocial.googleusercontent.com/gadgets/ifr?url=https://sites.google.com/site/drunkenduel/12minibattles.xml" frameborder="0" allowfullscreen></iframe>'>
</div><button class="c-button" type="button" onclick="PlayTo(this)">CLICK TO PLAY NOW</button>

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
			result: [
				"https://images-docs-opensocial.googleusercontent.com/gadgets/ifr?url=https://sites.google.com/site/drunkenduel/12minibattles.xml",
			],
		},
	},
	{
		embedMatch: {
			name: "frShort",
			segments: [
				`<div id="fr" data='<iframe width="100%" height="100%" src="`,
				[regex.url],
				`" frameborder="0" allowfullscreen></iframe>'></div><button class="c-button" type="button" onclick="PlayTo(this)">`,
				regex.alphaNumeric,
				`</button>`,
				regex.css,
				`<script>function PlayTo(i){var n=i.previousSibling;n.innerHTML=n.getAttribute("data"),i.style.display="none"}</script>`,
			],
		},
		test: {
			data: `<div id="fr" data='<iframe width="100%" height="100%" src="https://unblocked-games.s3.amazonaws.com/games/2022/unity3/fort-drifter/unblocked.html" frameborder="0" allowfullscreen></iframe>'></div><button class="c-button" type="button" onclick="PlayTo(this)">CLICK TO PLAY</button><style>.c-button{min-width:100%;font-family:fantasy;appearance:auto;border:0;border-color:#fff;border-radius:5px;background:#000;color:#fff;font-size:30px;cursor:pointer}.c-button:hover{background:#320d90}.c-button:focus{outline:0;box-shadow:0 0 0 4px #cbd6ee}.c-button{display:flex;align-items:center;justify-content:center;height:100%}</style><script>function PlayTo(i){var n=i.previousSibling;n.innerHTML=n.getAttribute("data"),i.style.display="none"}</script>`,
			result: [
				"https://unblocked-games.s3.amazonaws.com/games/2022/unity3/fort-drifter/unblocked.html",
			],
		},
	},
	{
		embedMatch: {
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
		},
		test: {
			data: `<div id="container">
<div id="fr" data='<iframe width="100%" height="100%" src="https://images-opensocial.googleusercontent.com/gadgets/ifr?url=https://cdn.jsdelivr.net/gh/classroom-googl/85@main/classroombot346346.xml" frameborder="0" allowfullscreen></iframe>'></div>
<button class="c-button" type="button" onclick="PlayTo(this)">CLICK TO PLAY</button>
<p id="unblocked-text">Google > Unblocked Games Premium :)</p>
</div>

<style>
#container {
  position: relative;
  width: 100%;
  height: 100%;
}

#fr {
  width: 100%;
  height: calc(100% - 40px);
}

.c-button {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  min-width: 100%;
  font-family: fantasy;
  appearance: auto;
  border: 0;
  border-color: #fff;
  border-radius: 5px;
  background: #000;
  color: #fff;
  font-size: 30px;
  cursor: pointer;
  z-index: 1;
}

.c-button:hover {
  background: #320d90;
}

#unblocked-text {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  font-family: fantasy;
  font-size: 20px;
  color: #fff;
  z-index: 1;
  text-shadow: 0 0 5px #000;
}
</style>

<script>
function PlayTo(button) {
  var iframe = document.getElementById("fr");
  iframe.innerHTML = iframe.getAttribute("data");
  button.style.display = "none";
}
</script>`,
			result: [
				"https://images-opensocial.googleusercontent.com/gadgets/ifr?url=https://cdn.jsdelivr.net/gh/classroom-googl/85@main/classroombot346346.xml",
			],
		},
	},
	{
		embedMatch: {
			name: "iframe",
			segments: [
				`<iframe title="`,
				regex.text,
				`" width="`,
				regex.number,
				`" height="`,
				regex.number,
				`" scrolling="no" frameborder="0" id="`,
				regex.number,
				`" name="`,
				regex.number,
				`" allowtransparency="true" class="igm" src="`,
				[regex.url],
				`"></iframe>`,
			],
		},
		test: {
			data: `<iframe title="Cat Burglar and The Magic Museum" width="800" height="450" scrolling="no" frameborder="0" id="1727296321" name="1727296321" allowtransparency="true" class="igm" src="//hc8qnd0v6h8opcjc06ug6rheebqsk2me-a-sites-opensocial.googleusercontent.com/gadgets/ifr?url=https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/1ee20621-61bc-4ec8-a8ec-5e839c2e6edc%252Fcat-burglar.xml&amp;container=enterprise&amp;view=default&amp;lang=en&amp;country=ALL&amp;sanitize=0&amp;v=df2618a2c4dc688c&amp;libs=core&amp;mid=59&amp;parent=https://sites.google.com/site/unblockedgame76/cat-burglar-the-magic-museum#st=e%3DAIHE3cCbMm40CpscdcbOR%252FuV%252BJWFZpZcIqWYiTO2zEWr7o5bhi2QiruMouPqyAxymS7Z8xTAe2lLxPatWWimNeHkeq2YhSL2030WQYmeBHktuLQ4VqFwJcZySdGqkzWea5Dwek3S%252F1gT%26c%3Denterprise&amp;rpctoken=-6996335742321257804"></iframe>`,
			result: [
				"//hc8qnd0v6h8opcjc06ug6rheebqsk2me-a-sites-opensocial.googleusercontent.com/gadgets/ifr?url=https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/1ee20621-61bc-4ec8-a8ec-5e839c2e6edc%252Fcat-burglar.xml&amp;container=enterprise&amp;view=default&amp;lang=en&amp;country=ALL&amp;sanitize=0&amp;v=df2618a2c4dc688c&amp;libs=core&amp;mid=59&amp;parent=https://sites.google.com/site/unblockedgame76/cat-burglar-the-magic-museum#st=e%3DAIHE3cCbMm40CpscdcbOR%252FuV%252BJWFZpZcIqWYiTO2zEWr7o5bhi2QiruMouPqyAxymS7Z8xTAe2lLxPatWWimNeHkeq2YhSL2030WQYmeBHktuLQ4VqFwJcZySdGqkzWea5Dwek3S%252F1gT%26c%3Denterprise&amp;rpctoken=-6996335742321257804",
			],
		},
	},
	{
		embedMatch: {
			name: "ajax",
			segments: [
				`<!DOCTYPE html>
<html>
<head>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap"> <!-- Google Fonts stil bağlantısı -->
    `,
				regex.css,
				`
</head>
<body>
    <div id="xmlContent">
        <iframe id="xmlIframe"></iframe>
    </div>
    <div id="playButton">CLICK TO PLAY*</div>
    <div id="footer">Unblocked Games Premium</div>

    <script>
        var playButton = document.getElementById("playButton");
        var xmlContent = document.getElementById("xmlContent");
        var xmlIframe = document.getElementById("xmlIframe");

        playButton.addEventListener("click", function() {
            playButton.style.display = "none";
            document.body.style.backgroundColor = "white";
            xmlContent.style.display = "block";
            $.ajax({
                type: "GET",
                url: "`,
				regex.url,
				`",
                dataType: "xml",
                success: function(xml) {
                    var xmlString = new XMLSerializer().serializeToString(xml);
                    xmlIframe.contentWindow.document.open();
                    xmlIframe.contentWindow.document.write(xmlString);
                    xmlIframe.contentWindow.document.close();
                    xmlIframe.style.display = "block";
                },
                error: function(xhr, status, error) {
                    console.error(error);
                }
            });
        });
    </script>
</body>
</html>`,
			],
		},
		test: {
			data: `<!DOCTYPE html>
<html>
<head>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap"> <!-- Google Fonts stil bağlantısı -->
    <style>
        body {
            background-color: #5B0E98;
            margin: 0;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }

        #playButton {
            display: block;
            width: 150px;
            height: 50px;
            background-color: black;
            color: white;
            text-align: center;
            line-height: 50px;
            cursor: pointer;
            transition: background-color 0.3s, border-radius 0.3s;
            border-radius: 8px;
            font-family: 'Open Sans', sans-serif; /* Google Fonts kullanımı */
            font-weight: 600; /* Kalınlığı */
            font-size: 16px; /* Yazı boyutu */
            margin-bottom: 20px;
        }

        #playButton:hover {
            background-color: darkgray;
            border-radius: 20px;
        }

        #xmlContent {
            display: none;
            width: 100%;
            height: 80vh;
        }

        #xmlIframe {
            width: 100%;
            height: 100%;
            border: none;
        }

        #footer {
            color: white;
            font-family: 'Open Sans', sans-serif;
            font-weight: 600;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div id="xmlContent">
        <iframe id="xmlIframe"></iframe>
    </div>
    <div id="playButton">CLICK TO PLAY*</div>
    <div id="footer">Unblocked Games Premium</div>

    <script>
        var playButton = document.getElementById("playButton");
        var xmlContent = document.getElementById("xmlContent");
        var xmlIframe = document.getElementById("xmlIframe");

        playButton.addEventListener("click", function() {
            playButton.style.display = "none";
            document.body.style.backgroundColor = "white";
            xmlContent.style.display = "block";
            $.ajax({
                type: "GET",
                url: "https://cdn.jsdelivr.net/gh/classroom-googl/85@main/64536agew.xml",
                dataType: "xml",
                success: function(xml) {
                    var xmlString = new XMLSerializer().serializeToString(xml);
                    xmlIframe.contentWindow.document.open();
                    xmlIframe.contentWindow.document.write(xmlString);
                    xmlIframe.contentWindow.document.close();
                    xmlIframe.style.display = "block";
                },
                error: function(xhr, status, error) {
                    console.error(error);
                }
            });
        });
    </script>
</body>
</html>`,
			result: [],
		},
	},
];
