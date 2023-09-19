import type { Cheerio, Element } from "cheerio";

export const loopOverElements = async (
	element: Cheerio<Element>,
	process: (i: number, elem: Element) => Promise<void>
): Promise<void> => {
	const promises: Promise<void>[] = [];

	element.each((i, elem) => {
		promises.push(process(i, elem));
	});

	await Promise.all(promises);
};
