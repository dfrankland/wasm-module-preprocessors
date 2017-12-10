import wasmModule from './sample.wasm';

window.sampleTest = async () => {
  const {
    instance: {
      exports: {
        main = () => undefined,
      },
    },
  } = await wasmModule();

  return main();
};
