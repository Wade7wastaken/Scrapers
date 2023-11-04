import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";

/** @type {import("webpack").Configuration} */
const config = {
	mode: "development",
	devtool: false,
	entry: "./src/index.ts",
	target: "node",
	output: {
		path: resolve(dirname(fileURLToPath(import.meta.url)), "dist"),
		filename: "bundle.cjs",
	},
	module: {
		rules: [
			{
				test: /\.ts(x)?$/,
				loader: "ts-loader",
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: [".ts", ".js", ".json"],
		plugins: [new TsconfigPathsPlugin()],
	},
};

export default config;
