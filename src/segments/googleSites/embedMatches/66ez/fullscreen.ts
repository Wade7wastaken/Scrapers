import { regex } from "@googleSites/regex.js";

import type { EmbedMatch } from "@googleSites/processDataCode.js";

export const fullscreen: EmbedMatch = {
	name: "fullscreen",
	segments: [
		`<button class="c-button">`,
		regex.text,
		`</button>
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
