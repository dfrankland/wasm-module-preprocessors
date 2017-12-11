# wasm-module-loader

A [Webpack][webpack] loader that wraps
[`wasm-module-preprocessor`][wasm-module-preprocessor].

[webpack]: https://webpack.js.org/

## Install

```bash
npm install --save-dev wasm-module-preprocessor
```

## [Usage][webpack-loader-concepts]

[webpack-loader-concepts]: https://webpack.js.org/concepts/loaders/

`wasm-module-loader` by default loads wasm modules asynchronously, and takes an
optional `importObject`. All wasm modules are validated on build, so that there
is no need for runtime testing and beyond just validating wasm modules, the size
of the wasm module is checked too.

## Async

**file.js**

```js
import wasmModule from 'factorial.wasm';

export default async () => {
  const {
    instance: {
      exports: {
        factorial = () => undefined,
      },
    },
  } = await wasmModule(
    // Add an optional `importObject`:
    // {
    //   global: {},
    //   env: {},
    // }
  );

  return factorial(number);
}
```

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.wasm?$/,
        use: [
          {
            loader: 'wasm-module-loader',
            options: {
              // Defaults to:
              // sync: false,
            },
          },
        ],
      },
    ],
  },
};
```

### Sync

**file.js**

```js
import wasmModule from 'factorial.wasm';

export default () => {
  const {
    exports: {
      factorial = () => undefined,
    },
  } = wasmModule(
    // Add an optional `importObject`:
    // {
    //   global: {},
    //   env: {},
    // }
  );

  return factorial(number);
}
```

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.wasm?$/,
        use: [
          {
            loader: 'wasm-module-loader',
            options: {
              // Only use this for small wasm modules. The max size of the
              // binary will, by default, be restricted to less than 4KiB.
              sync: false,
            },
          },
        ],
      },
    ],
  },
};
```

## Options

All options are defined by and are passed directly to
[`wasm-module-preprocessor`][wasm-module-preprocessor]; check its documentation
for more a in-depth explanation.

[wasm-module-preprocessor]: https://github.com/dfrankland/wasm-module-preprocessors/tree/master/packages/wasm-module-preprocessor
