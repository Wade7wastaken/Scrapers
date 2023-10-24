export {
  
}

export const frEmbed = `<div id=fr data='<iframe width="100%" height="100%" src="https://gg-opensocial.googleusercontent.com/gadgets/ifr?url=https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/1ee20621-61bc-4ec8-a8ec-5e839c2e6edc%2F1-on-1-basketball.xml" frameborder="0" allowfullscreen></iframe>'>
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
</script>`;

export const fullscreenEmbed = `<button class="c-button">PLAY FULLSCREEN</button>
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
    </script>`;

export const ruffleEmbed = `<object xmlns="http://www.w3.org/1999/xhtml" 
data="https://cdn.jsdelivr.net/gh/UndercoverMoose/flashgames@6a11175e9c021f8359d626300aa73e16ef9c6ebd/games/sift-renegade.swf" 
height="100%" type="application/x-shockwave-flash" width="100%"><param name="movie" value="" />
</object><script src="https://cdn.jsdelivr.net/gh/h3sj7v2f6k/ruffle@e51038cf55e61bb46ea4d39ed05169ff69f8795b/ruffle.js"></script>`;

export const premiumFrEmbed = `<div id=fr data='<iframe width="100%" height="100%" src="https://images-docs-opensocial.googleusercontent.com/gadgets/ifr?url=https://sites.google.com/site/drunkenduel/12minibattles.xml" frameborder="0" allowfullscreen></iframe>'>
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
</script>`;

export const premiumWrappedFrEmbed = `<div id="container">
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
</script>`;

export const ajaxEmbed = `<!DOCTYPE html>
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
</html>`;
