import { readFileSync } from 'fs';
import { resolve as resolvePath } from 'path';
import { runInNewContext } from 'vm';
import wasmModulePreprocessor from '../';

const bufferSource = readFileSync(resolvePath(__dirname, './__fixtures__/factorial.wasm'));

describe('wasm-module-preprocessor', () => {
  it('works using defaults', async () => {
    const wasmModuleExportString = wasmModulePreprocessor(bufferSource);
    const wasmModuleExport = runInNewContext(`(() => ${wasmModuleExportString})()`);
    const {
      instance: {
        exports: {
          factorial = () => undefined,
        },
      },
    } = await wasmModuleExport();
    expect(factorial(10)).toEqual(3628800);
  });

  it('accepts strings', async () => {
    const wasmModuleExportString = wasmModulePreprocessor(bufferSource.toString('binary'));
    const wasmModuleExport = runInNewContext(`(() => ${wasmModuleExportString})()`);
    const {
      instance: {
        exports: {
          factorial = () => undefined,
        },
      },
    } = await wasmModuleExport();
    expect(factorial(10)).toEqual(3628800);
  });

  it('can work synchronously', async () => {
    const wasmModuleExportString = wasmModulePreprocessor(
      bufferSource,
      { sync: true, maxBufferSourceSizeSync: Infinity },
    );
    const wasmModuleExport = runInNewContext(`(() => ${wasmModuleExportString})()`);
    const {
      exports: {
        factorial = () => undefined,
      },
    } = wasmModuleExport();
    expect(factorial(10)).toEqual(3628800);
  });

  it('accepts `undefined`, but fails to validate', async () => {
    expect(wasmModulePreprocessor).toThrow();
  });

  it('checks size of `bufferSource`', async () => {
    expect(() => {
      wasmModulePreprocessor(Buffer.alloc(1), { sync: true, maxBufferSourceSizeSync: 0 });
    }).toThrow();
    expect(() => {
      wasmModulePreprocessor(Buffer.alloc(1), { maxBufferSourceSize: 0 });
    }).toThrow();
  });
});
