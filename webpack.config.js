import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { TsconfigPathsPlugin } from "tsconfig-paths-webpack-plugin";
import nodeExternals from "webpack-node-externals";

/** @type {import("webpack").Configuration} */
const config = {
	mode: "development",
	// source-map is the slowest but idrc
	devtool: "source-map",
	entry: "./src/index.ts",
	target: "node",
	output: {
		path: resolve(dirname(fileURLToPath(import.meta.url)), "dist"),
		filename: "bundle.js",
		module: true,
		chunkFormat: "module",
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
	experiments: {
		outputModule: true,
	},
	externals: [
		nodeExternals({
			importType: "module",
		}),
	],
};

export default config;
