import "axios";
import type { Context } from "./context";

declare module "axios" {
	// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
	export interface AxiosRequestConfig {
		ctx: Context;
	}
}
