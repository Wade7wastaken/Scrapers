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
};
