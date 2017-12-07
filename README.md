# wasm-module-preprocessors

A monorepo of loaders and plugins that preprocess WebAssembly (wasm) modules.

## Modules

*   [`wasm-module-preprocessor`][wasm-module-preprocessor]

    A general-purpose module for preprocessing WebAssembly.

[wasm-module-preprocessor]: https://github.com/dfrankland/wasm-module-preprocessors/tree/master/packages/wasm-module-preprocessor

*   [`wasm-module-loader`][wasm-module-loader]

    A [Webpack][webpack] loader that wraps `wasm-module-preprocessor`.

[wasm-module-loader]: https://github.com/dfrankland/wasm-module-preprocessors/tree/master/packages/wasm-module-loader
[webpack]: https://webpack.js.org/

*   [`rollup-plugin-wasm-module`][rollup-plugin-wasm-module]

    A [Rollup][rollup] plugin that wraps `wasm-module-preprocessor`.

[rollup-plugin-wasm-module]: https://github.com/dfrankland/wasm-module-preprocessors/tree/master/packages/rollup-plugin-wasm-module
[rollup]: https://rollupjs.org/

## Using the Monorepo

To test, build, and publish, etc. use the top-level `npm` scripts that utilize
[Lerna][lerna].

[lerna]: https://github.com/lerna/lerna/
