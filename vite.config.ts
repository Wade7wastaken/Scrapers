import tsConfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/dist/config.js";

export default defineConfig({
	plugins: [tsConfigPaths()],
});
