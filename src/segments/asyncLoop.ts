export const asyncLoop = async <T>(
	array: Iterable<T>,
	process: (elem: T) => Promise<void>
): Promise<void> => {
	const promises: Promise<void>[] = [];

	for (const e of array) promises.push(process(e));

	await Promise.all(promises);
};
