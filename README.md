# Scrapers

A script that scrapes games from multiple game sites. Used in
[this](https://github.com/Wade7wastaken/Website) project.

## Tech Stack

-   [PNPM](https://pnpm.io/)

Fastest package manager I've seen. (nvm bun exists, updating to that soon) Use
`pnpm i` to install packages, `pnpm add packageName` to add a new package, and
`pnpm update -L` to update all packages to their latest version. Be sure to test
for issues before committing package updates (really just talking to myself).

-   [TypeScript](https://www.typescriptlang.org/)

Pretty self-explanatory. Provides types and makes large-ish projects like this
possible

-   [Webpack](https://webpack.js.org/)

The newest addition to this project. Using only `tsc` was getting pretty old and
slow, and custom TypeScript paths didn't work at all, so I switched to Webpack.
Webpack is set up to export source maps, so debugging still works perfectly in
VS Code. Webpack is a little slower than tsc, but I think its worth it. I've
also looked into things like `ts-node`, but I couldn't get them to "just work"
in VSCode with debugging. If you know of a way, please make a PR.

-   [VITest](https://vitest.dev/)

Pretty similar to Jest, but with better TypeScript support. Tests are only used
in Google Sites Matches and the occasional util function.

-   [ESLint](https://eslint.org/)

Makes sure code follows certain rules. Install the `ESLint` VSCode extension for
in-editor support. If you find an issue or possible improvement with the ESLint
config, make an issue; I'm open to change.

-   [Prettier](https://prettier.io/)

Makes the code prettier. Pretty self explanatory. Again, make sure you have the
`Prettier` VS Code extension

# Debugging

I've only tested debugging in VS Code. If you would like to use another editor,
you are on your own. Unless it's a super easy fix, I won't change any configs so
this project works in XYZ editor.

In VS Code, pressing the `Start Debugging` button (`F5` by default) to begin
debugging. Check out `.vscode/launch.json` for the configuration.

# Contributing

PRs and issues are always welcome! If you find a game website you think would be
easy to scrape, open an issue. Better yet, add it and make a PR.
