export const asyncLoop = async (
	start: number,
	end: number,
	increment: number,
	process: (i: number) => Promise<void>
): Promise<void> => {
	const promises: Promise<void>[] = [];

	for (let i = start; i > end; i += increment) promises.push(process(i));

	await Promise.all(promises);
};
