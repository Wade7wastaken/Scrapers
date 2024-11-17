import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import prettier from "eslint-config-prettier";
import importX from "eslint-plugin-import-x";
import unicorn from "eslint-plugin-unicorn";
import vitest from "eslint-plugin-vitest";
import ts from "typescript-eslint";

export default ts.config(
	js.configs.recommended,
	importX.flatConfigs.recommended,
	importX.flatConfigs.typescript,
	...ts.configs.strictTypeChecked,
	...ts.configs.stylisticTypeChecked,
	unicorn.configs["flat/recommended"],
	prettier,
	{
		ignores: ["node_modules/", "vite.config.ts", "dist/", "results/"],
	},
	{
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				project: true,
			},
			ecmaVersion: "latest",
			sourceType: "module",
		},
		rules: {
			// TypeScript Rules
			"@typescript-eslint/consistent-type-exports": "warn",
			"@typescript-eslint/consistent-type-imports": "warn",
			"@typescript-eslint/explicit-function-return-type": "warn",
			"@typescript-eslint/explicit-member-accessibility": "warn",
			"@typescript-eslint/prefer-readonly": "warn",
			"@typescript-eslint/no-unused-vars": [
				"warn",
				{ args: "all", argsIgnorePattern: "^_" },
			],
			"@typescript-eslint/no-explicit-any": "warn",
			"@typescript-eslint/no-non-null-assertion": "warn",
			"@typescript-eslint/prefer-nullish-coalescing": "warn",
			"@typescript-eslint/prefer-optional-chain": "warn",
			"@typescript-eslint/consistent-type-definitions": ["error", "type"],
			"@typescript-eslint/restrict-template-expressions": [
				"warn",
				{
					allowNumber: true,
					allowBoolean: true,
				},
			],

			// Import Rules
			"import-x/namespace": "error",
			"import-x/order": [
				"warn",
				{
					"newlines-between": "always",
					alphabetize: { order: "asc", caseInsensitive: true },
					groups: [
						"builtin",
						"external",
						"parent",
						"sibling",
						"index",
						"type",
					],
				},
			],

			// Unicorn Rules
			"unicorn/filename-case": [
				"error",
				{
					cases: {
						camelCase: true,
					},
				},
			],
			"unicorn/prevent-abbreviations": "off",
		},
	},
	{
		files: ["**/*.js"],
		...ts.configs.disableTypeChecked,
	},
	{
		files: ["**/*.test.ts"],
		plugins: {
			vitest,
		},
		rules: {
			...vitest.configs.recommended.rules,
		},
	},
	{
		files: ["eslint.config.js"],
		rules: {
			"import-x/no-named-as-default-member": "off",
		},
	}
);
