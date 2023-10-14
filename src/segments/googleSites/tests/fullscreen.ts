import { stopAtQuot, text, url } from "../regex.js";
import type { EmbedTestCase } from "../testEmbed.js";

import { ending } from "./segments/ending.js";

export const fullscreen: EmbedTestCase = {
	name: "fullscreen",
	test: {
		testSegments: [
			`<div jsname="jkaScf" jscontroller="szRU7e" class="w536ob" data-enable-interaction="true" data-url="`,
			url,
			`" data-code="<button class=&quot;c-button&quot;>`,
			text,
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
    `,
			...ending,
		],
		outputIndices: [5],
	},
};
