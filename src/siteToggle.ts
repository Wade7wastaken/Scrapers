import type * as sites from "@sites";

type SiteName = (typeof sites)[keyof typeof sites]["displayName"];

export const enabledSites: SiteName[] = [
	// "Coolmath Games",
	// "CrazyGames",
	"Poki",
];
