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
import { regex } from "@utils";

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
	const { ctx, results } = init("Unblocked Premium");

	await processGoogleSite(
		ctx,
		results,
		"https://sites.google.com/view/games-unblockedd/",
		IGNORED_GAMES,
		removeTest(matches)
	);

	return Ok(cleanUp(ctx, results));
};

export const matches: EmbedMatchWithTest[] = [
	{
		embedMatch: fr,
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
	{
		embedMatch: {
			name: "unity",
			segments: [
				`<link rel="stylesheet" href="`,
				regex.url,
				`">
<script src="`,
				regex.url,
				`"></script>
    <script src="`,
				regex.url,
				`"></script>

    <script type="text/javascript">
      var gameInstance;
      window.onload = function () {
        let  bttn = document.createElement( "button" );
        bttn.appendChild(document.createTextNode( "`,
				regex.text,
				`" ));
        bttn.setAttribute('id', 'run_game');
        bttn.style.display = 'none';
        bttn.style.position = 'absolute';
        document.body.appendChild(bttn);
        bttn.style.display = 'block';
        bttn.style.left = ((document.body.clientWidth - bttn.offsetWidth)/2) + 'px';
        bttn.style.top = ((document.body.clientHeight - bttn.offsetHeight)/2) + 'px';
        bttn.onclick = function () {
          gameInstance = UnityLoader.instantiate("gameContainer", "`,
				regex.url,
				`", {onProgress: UnityProgress,Module:{onRuntimeInitialized: function() {UnityProgress(gameInstance, "complete")}}});
          this.remove();
        }
      }
    </script>
    <div class="webgl-content">
      <div id="gameContainer" style="width: 100%; height: 100%; margin: auto"></div>
    </div>
`,
				regex.css,
			],
		},
		test: {
			data: `<link rel="stylesheet" href="https://sites.google.com/site/v113ks4k/style.css">
    <script src="https://sites.google.com/site/v113ks4k/UnityProgress.js"></script>
    <script src="https://sites.google.com/site/s016y7u/ducklife-3.js"></script>

    <script type="text/javascript">
      var gameInstance;
      window.onload = function () {
        let  bttn = document.createElement( "button" );
        bttn.appendChild(document.createTextNode( "PLAY NOW" ));
        bttn.setAttribute('id', 'run_game');
        bttn.style.display = 'none';
        bttn.style.position = 'absolute';
        document.body.appendChild(bttn);
        bttn.style.display = 'block';
        bttn.style.left = ((document.body.clientWidth - bttn.offsetWidth)/2) + 'px';
        bttn.style.top = ((document.body.clientHeight - bttn.offsetHeight)/2) + 'px';
        bttn.onclick = function () {
          gameInstance = UnityLoader.instantiate("gameContainer", "https://images-docs-opensocial.googleusercontent.com/gadgets/proxy?container=fbk&url=https://sites.google.com/site/s016y7u/ducklife-3.json", {onProgress: UnityProgress,Module:{onRuntimeInitialized: function() {UnityProgress(gameInstance, "complete")}}});
          this.remove();
        }
      }
    </script>
    <div class="webgl-content">
      <div id="gameContainer" style="width: 100%; height: 100%; margin: auto"></div>
    </div>
<style>
button {
  min-width: 100%;
  font-family: fantasy;
  appearance: none;
  border: 1;
  border-radius: 19px;
  background: #000;
  color: #fff;
  padding: 18px 46px;
  font-size: 42px;
  cursor: pointer;
}
button:hover {
  background: #411b73;
}
button:focus {
  outline: none;
  box-shadow: 0 0 0 0px #cbd6ee;
} 
button {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
}
</style>`,
			result: [],
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
  border-radius: 5px;
  background: #320d90;
  color: #fff;
  padding: 0px 46px;
  font-size: 24px;
  cursor: pointer;
}

.c-button:hover {
  background: #000000;
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
        var url = "https://images-opensocial.googleusercontent.com/gadgets/ifr?url=https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/1ee20621-61bc-4ec8-a8ec-5e839c2e6edc%2Fragdoll-achievement.xml";

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
				"https://images-opensocial.googleusercontent.com/gadgets/ifr?url=https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/1ee20621-61bc-4ec8-a8ec-5e839c2e6edc%2Fragdoll-achievement.xml",
			],
		},
	},
];
