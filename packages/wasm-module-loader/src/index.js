import loaderUtils from 'loader-utils';
import wasmModulePreprocessor from 'wasm-module-preprocessor';

const wasmModuleLoader = function wasmModuleLoader(code, s, meta) {
  const callback = this.async();

  const options = loaderUtils.getOptions(this) || {};

  (async () => {
    try {
      const content = wasmModulePreprocessor(code, options);
      callback(null, content, null, meta);
    } catch (err) {
      callback(err, null, null, meta);
    }
  })();
};

wasmModuleLoader.raw = true;

export default wasmModuleLoader;
