# Scrapers

A script that scrapes games from multiple game sites. Used in
[this](https://github.com/Wade7wastaken/Website) project.

## Tech Stack

-   [PNPM](https://pnpm.io/)

-   [TypeScript](https://www.typescriptlang.org/)

-   [Webpack](https://webpack.js.org/)

Using only Typescript to transpile the project was getting annoying, and custom
TypeScript paths didn't work at all, so I switched to Webpack. Webpack is set up
to export source maps, so debugging still works perfectly in VSCode. Webpack is
a little slower than tsc, but I think its worth it. I've also looked into things
like `ts-node`, but I couldn't get them to "just work" in VSCode with debugging.
If you know of a way, please make a PR.

-   [VITest](https://vitest.dev/)

Pretty similar to Jest, but with better TypeScript support. Tests are only used
in Google Sites Matches and the occasional util function.

-   [ESLint](https://eslint.org/)

-   [Prettier](https://prettier.io/)

# Debugging

I've only tested debugging in VS Code. If you would like to use another editor,
you are on your own. Unless it's a super easy fix, I won't change any configs so
this project works in XYZ editor.

In VS Code, press the `Start Debugging` button (`F5` by default) to begin
debugging. See `.vscode/launch.json` for the configuration.

# Contributing

PRs and issues are always welcome! If you find a game website you think would be
easy to scrape, open an issue. Better yet, add it and make a PR.
