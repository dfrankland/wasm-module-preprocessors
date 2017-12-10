const defaultTemplate = {
  moduleExport: ({ importObjectArg, wasmModuleInstance }) => (
    `function wasmModuleInstance(${importObjectArg}) {\n  return ${wasmModuleInstance};\n}`
  ),

  wasmModuleInstanceSync: ({ bufferSource, importObject }) => (
    `new WebAssembly.Instance(new WebAssembly.Module(${bufferSource}), ${importObject});`
  ),

  wasmModuleInstance: ({ bufferSource, importObject }) => (
    `WebAssembly.instantiate(${bufferSource}, ${importObject})`
  ),

  // A typed array or ArrayBuffer containing the binary code of the wasm
  // module you want to compile.
  bufferSource: ({ buffer }) => (
    `Uint8Array.from(${JSON.stringify([...buffer.values()])})`
  ),

  defaultImportObject: ({ importObjectArg }) => (
    `${importObjectArg} && typeof ${importObjectArg} === 'object' ? ${importObjectArg} : {}`
  ),

  importObjectArg: 'importObject',
};

export default (
  // This is the Buffer or string from your `.wasm` file.
  wasmBufferOrString = Buffer.alloc(0),
  {
    // For the encoding of the string, `wasmBufferOrString`.
    encoding = 'binary',

    // Max size of `wasmBufferOrString`.
    // https://github.com/v8/v8/blob/793c52ed26daa002ba81a0bb4c20d809d0e33592/src/wasm/wasm-limits.h#L31
    maxBufferSourceSize = 1024 ** 3, // 1 << 30

    // Max size of `wasmBufferOrString` for synchronous compilation.
    // https://chromium.googlesource.com/chromium/src.git/+/master/third_party/WebKit/Source/bindings/core/v8/V8Initializer.cpp#135
    maxBufferSourceSizeSync = 1024 * 4, // 1 << 12

    // Whether or not to validate the `wasmBufferOrString`.
    validate = true,

    // Whether or not the wasm module should be synchronous.
    sync = false,

    // Template object for constructring the transformed wasm module.
    template = {},
  } = {},
) => {
  // Checks if `wasmBufferOrString` is a Buffer, and if it is not, changes it
  // into one using the `encoding` setting.
  const buffer = Buffer.isBuffer(wasmBufferOrString) ? (
    wasmBufferOrString
  ) : (
    Buffer.from(wasmBufferOrString, encoding)
  );

  // Size validation
  const { byteLength } = buffer;
  if (byteLength >= (sync ? maxBufferSourceSizeSync : maxBufferSourceSize)) {
    throw new Error((
      `${
        sync ? 'synchronous ' : ''
      }buffer source exceeds maximum size of ${
        sync ? maxBufferSourceSizeSync : maxBufferSourceSize
      } (is ${
        byteLength
      })`
    ));
  }

  // Actual validation of `buffer`
  if (validate && !WebAssembly.validate(Uint8Array.from([...buffer.values()]))) {
    throw new Error('buffer source is not a valid WebAssembly module');
  }

  const {
    importObjectArg,
    defaultImportObject,
    bufferSource,
    wasmModuleInstance,
    wasmModuleInstanceSync,
    moduleExport,
  } = {
    ...defaultTemplate,
    ...template,
  };

  const moduleInstanceString = (
    sync ? wasmModuleInstanceSync : wasmModuleInstance
  )({
    bufferSource: bufferSource({ buffer }),
    importObject: defaultImportObject({ importObjectArg }),
  });

  return moduleExport({ importObjectArg, wasmModuleInstance: moduleInstanceString });
};
