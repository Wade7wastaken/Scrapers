import tsConfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/dist/config";

export default defineConfig({
	plugins: [tsConfigPaths()],
});
