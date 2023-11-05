import type { EmbedMatch } from "@googleSites/processDataCode";
import { regex } from "@googleSites/regex";

export const frWrapped: EmbedMatch = {
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
	],
};
