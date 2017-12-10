import { createFilter } from 'rollup-pluginutils';
import wasmModulePreprocessor from 'wasm-module-preprocessor';

export default ({
  include = ['**/*.wasm'],
  exclude,
  options,
} = {}) => {
  const filter = createFilter(include, exclude);
  return {
    name: 'wasm-module',
    transform: (code, id) => {
      if (!filter(id)) return null;
      return `export default ${wasmModulePreprocessor(code, options)}`;
    },
  };
};
