import type { EmbedMatch } from "../../processDataCode";
import { regex } from "../../regex";


export const ajax: EmbedMatch = {
	name: "ajax",
	segments: [
		`<!DOCTYPE html>
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
};
