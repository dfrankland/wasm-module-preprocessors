# rollup-plugin-wasm-module

A [Rollup][rollup] plugin that wraps
[`wasm-module-preprocessor`][wasm-module-preprocessor].

[rollup]: https://rollupjs.org/

## Install

```bash
npm install --save-dev rollup-plugin-wasm-module
```

## [Usage][rollup-wiki-plugins]

[rollup-wiki-plugins]: https://github.com/rollup/rollup/wiki/Plugins

`rollup-plugin-wasm-module` by default loads wasm modules asynchronously, and
takes an optional `importObject`. All wasm modules are validated on build, so
that there is no need for runtime testing and beyond just validating wasm
modules, the size of the wasm module is checked too.

### Async

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

**rollup.config.js**

```js
import wasmModule from 'rollup-plugin-wasm-module';

export default {
  plugins: [
    wasmModule({
      options: {
        // Defaults to:
        // sync: false,
      }
    }),
  ],
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

**rollup.config.js**

```js
import wasmModule from 'rollup-plugin-wasm-module';

export default {
  plugins: [
    wasmModule({
      options: {
        // Only use this for small wasm modules. The max size of the binary
        // will, by default, be restricted to less than 4KiB.
        sync: false,
      }
    }),
  ],
};
```

## Options

All options are defined by and are passed directly to
[`wasm-module-preprocessor`][wasm-module-preprocessor]; check its documentation
for more a in-depth explanation.

[wasm-module-preprocessor]: https://github.com/dfrankland/wasm-module-preprocessors/tree/master/packages/wasm-module-preprocessor
