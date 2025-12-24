import { Console, Effect } from "effect";
import { HttpService } from "../main";
import { HttpClientRequest } from "@effect/platform";
import { load } from "cheerio";

export const run = Effect.gen(function* () {
	const client = yield* HttpService;
	const request = HttpClientRequest.get("https://poki.com/en/categories");
	const response = yield* client.get(request);
	const text = yield* response.text;

	const $ = load(text);

	const categories = $(".DIxbY_Wd8M99mMzbD9Jz.Ll7V72dm63WTr1buD4lg")
		.map((i, el) => {
			const href = el.attribs.href;
			const text = $(el).text();
			return href === undefined
				? Effect.fail("No href")
				: Effect.succeed([text, href]);
		})
		.toArray();

	yield* Console.log(categories.length);
	return [];
});

export const displayName = "Poki";

