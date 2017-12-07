export default (
  wasmBufferOrString = Buffer.alloc(0),
  { encoding = 'binary', sync = false } = {},
) => {
  const buffer = Buffer.isBuffer(wasmBufferOrString) ? (
    wasmBufferOrString
  ) : (
    Buffer.from(wasmBufferOrString, encoding)
  );

  return (
    `module.exports =${
      sync ? ' new ' : ' '
    }WebAssembly.${
      sync ? 'Module' : 'compile'
    }(Uint8Array.from(${
      JSON.stringify([...buffer.values()])
    }));`
  );
};
