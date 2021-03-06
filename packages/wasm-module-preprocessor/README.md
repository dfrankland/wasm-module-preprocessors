# wasm-module-preprocessor

A general-purpose module for preprocessing WebAssembly (wasm).

## Install

```bash
npm install --save-dev wasm-module-preprocessor
```

## Usage

`wasm-module-preprocessor` by default loads wasm modules asynchronously, and
takes an optional `importObject`. All wasm modules are validated on build, so
that there is no need for runtime testing and beyond just validating wasm
modules, the size of the wasm module is checked too.

### Async

**file.wasm**

```
<RANDOM GARBLED BINARY DATA>
```

**test.js**

```js
import wasmModulePreprocessor from 'wasm-module-preprocessor';
import { readFileSync } from 'fs';
import { runInNewContext } from 'vm';

const bufferSource = readFileSync('file.wasm');

const wasmModuleExportString = wasmModulePreprocessor(
  bufferSource,
  {
    // Defaults to:
    // sync: false,
  }
);

const wasmModuleExport = runInNewContext(`(() => ${wasmModuleExportString})()`);

(async () => {
  try {
    const {
      instance: {
        exports: {
          main = () => undefined,
        },
      },
    } = await wasmModuleExport(
      // Add an optional `importObject`:
      // {
      //   global: {},
      //   env: {},
      // }
    );

    console.log(main() === 3); // true
  } catch (err) {
    console.error(err);
  }
})();
```

### Sync


**file.wasm**

```
<RANDOM GARBLED BINARY DATA>
```

**test.js**

```js
import wasmModulePreprocessor from 'wasm-module-preprocessor';
import { readFileSync } from 'fs';
import { runInNewContext } from 'vm';

const bufferSource = readFileSync('file.wasm');

const wasmModuleExportString = wasmModulePreprocessor(
  bufferSource,
  // Only use this for small wasm modules. The max size of the
  // binary will, by default, be restricted to less than 4KiB.
  { sync: true },
);

const wasmModuleExport = runInNewContext(`(() => ${wasmModuleExportString})()`);

const {
  exports: {
    main = () => undefined,
  },
} = wasmModuleExport(
  // Add an optional `importObject`:
  // {
  //   global: {},
  //   env: {},
  // }
);

console.log(main() === 3); // true
```

## Documentation

### wasmModulePreprocessor(bufferSource\[, options\])

*   `bufferSource` `<string>` | `<Buffer>` *Default:* `<Buffer >`

*   `options` `<Object>`

    *   `encoding` `<string>` *Default:* `'binary'`

    *   `maxBufferSourceSize` `<integer>` *Default:* `1073741824`

    *   `maxBufferSourceSizeSync` `<integer>` *Default:* `4096`

    *   `validate` `<boolean>` *Default:* `true`

    *   `sync` `<boolean>` *Default:* `false`

    *   `template` `<Object>`

        *   `importObjectArg` `<string>`

        *   `defaultImportObject` `<Function>`

            *   `templateArgs` `<Object>`

                *   `importObjectArg` `<string>`

        *   `bufferSource` `<Function>`

            *   `templateArgs` `<Object>`

                *   `buffer` `<Buffer>`

        *   `wasmModuleInstance` `<Function>`

            *   `templateArgs` `<Object>`

                *   `bufferSource` `<string>`

                *   `importObject` `<string>`

        *   `wasmModuleInstanceSync` `<Function>`

            *   `templateArgs` `<Object>`

                *   `bufferSource` `<string>`

                *   `importObject` `<string>`

        *   `moduleExport` `<Function>`

            *   `templateArgs` `<Object>`

                *   `bufferSource` `<string>`

                *   `importObject` `<string>`

`bufferSource` is the data from the binary wasm file. `encoding` is ignored if
`bufferSource` is a buffer.

`maxBufferSourceSize` is the maximum size in bytes that the `bufferSource` can
be and defaults to the max allowed by Node/V8 and most browsers.
`maxBufferSourceSizeSync` is the maximum size in bytes that the `bufferSource`
can be if used synchronously and defaults the max allowed by Chrome and most
other browsers (Node/V8 has no such limitation).

`validate` is whether or not `WebAssembly.validate` is used to check the
`bufferSource` before preprocessing.

`sync` is whether or not to preprocess the module as synchronous.

`template` is an object with properties to construct the string returned.
