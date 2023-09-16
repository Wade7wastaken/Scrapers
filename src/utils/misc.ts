export const sleep = (ms: number): Promise<void> =>
	new Promise((r) => setTimeout(r, ms));

export const lowerCaseSort = (
	a: [string, string],
	b: [string, string]
): number => a[0].toLowerCase().localeCompare(b[0].toLowerCase());

export const capitalize = (s: string): string =>
	s[0]?.toUpperCase() + s.slice(1);
