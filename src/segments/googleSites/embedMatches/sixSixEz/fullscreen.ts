import type { EmbedMatch } from "@googleSites/processDataCode";
import { regex } from "@googleSites/regex";

export const fullscreen: EmbedMatch = {
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
};
