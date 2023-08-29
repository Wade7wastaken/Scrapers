const url = "https://api.poki.com/search/query/3?q=";

const output = [];

(async () => {
	const games = {};

	for (let i = 0; i < 26; i++) {
		const letter = String.fromCharCode(97 + i);
		console.log(letter);
		const request = await fetch(url + letter);
		const json = await request.json();

		for (const game of json.games) {
			games[game.id] = game;
		}
	}

	for (const id in games) {
		const game = games[id];
		console.log(game.title, game.slug);
		output.push([game.title, `https://poki.com/en/g/${game.slug}`]);
	}
})();
