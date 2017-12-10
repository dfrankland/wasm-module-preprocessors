import wasmModule from './factorial.wasm';

window.factorialTest = async (number) => {
  const {
    instance: {
      exports: {
        factorial = () => undefined,
      },
    },
  } = await wasmModule();

  return factorial(number);
};
