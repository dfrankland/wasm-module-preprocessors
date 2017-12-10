import { createFilter } from 'rollup-pluginutils';
import { readFileSync } from 'fs';
import wasmModulePreprocessor from 'wasm-module-preprocessor';

export default ({
  include = ['**/*.wasm'],
  exclude,
  options,
} = {}) => {
  const filter = createFilter(include, exclude);
  return {
    name: 'wasm-module',

    // Need to use this `load` function becuase Rollup's default `load` uses
    // `utf8` encoding which corrupts some binary files.
    load: (id) => {
      if (!filter(id)) return null;

      const buffer = readFileSync(id);

      const defaultEncodedString = buffer.toString('utf8');
      const binaryEncodedString = buffer.toString('binary');

      if (defaultEncodedString === binaryEncodedString) return null;

      return binaryEncodedString;
    },

    transform: (code, id) => {
      if (!filter(id)) return null;
      return `export default ${wasmModulePreprocessor(code, options)}`;
    },
  };
};
