import loaderUtils from 'loader-utils';
import wasmModulePreprocessor from 'wasm-module-preprocessor';

module.exports = function wasmModuleLoader(code, s, meta) {
  const callback = this.async();

  const options = loaderUtils.getOptions(this) || {};

  (async () => {
    try {
      const content = `export default ${wasmModulePreprocessor(code, options)}`;
      callback(null, content, null, meta);
    } catch (err) {
      callback(err, null, null, meta);
    }
  })();
};

module.exports.raw = true;
