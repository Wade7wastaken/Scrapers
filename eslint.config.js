import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import importX from "eslint-plugin-import-x";
import unicorn from "eslint-plugin-unicorn";
import vitest from "eslint-plugin-vitest";
import ts from "typescript-eslint";

export default ts.config(
	js.configs.recommended,
	...ts.configs.strictTypeChecked,
	...ts.configs.stylisticTypeChecked,
	// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
	unicorn.configs["flat/recommended"],
	// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
	prettier,
	{
		ignores: ["node_modules/", "vite.config.ts", "dist/", "results/"],
	},
	{
		languageOptions: {
			parserOptions: {
				project: true,
				tsconfigRootDir: import.meta.dirname,
				ecmaVersion: "latest",
				sourceType: "module",
			},
		},
		plugins: {
			"import-x": importX,
		},
		settings: {
			"import-x/parsers": {
				"@typescript-eslint/parser": [".ts"],
			},
			"import-x/resolver": {
				typescript: true,
				node: true,
			},
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

			// Import Rules
			"import-x/no-unresolved": "error",
			"import-x/named": "error",
			"import-x/namespace": "error",
			"import-x/default": "error",
			"import-x/export": "error",
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
		files: ["**/*.test.ts"],
		plugins: {
			vitest,
		},
		rules: {
			...vitest.configs.recommended.rules,
		},
	}
);

