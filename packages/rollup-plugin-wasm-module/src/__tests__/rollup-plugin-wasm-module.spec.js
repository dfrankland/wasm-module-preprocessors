import { rollup } from 'rollup';
import { resolve as resolvePath } from 'path';
import puppeteer from 'puppeteer';
import wasmModule from '../';

const rollupConfig = {
  input: resolvePath(__dirname, './__fixtures__/main.js'),
  plugins: [wasmModule()],
};

describe('rollup-plugin-wasm-module', () => {
  it('compiles wasm binary to WebAssembly module instance', async () => {
    const bundle = await rollup(rollupConfig);
    const outputOptions = { format: 'iife' };
    const { code } = await bundle.generate(outputOptions);
    await bundle.write({
      ...outputOptions,
      file: resolvePath(__dirname, '../../build/bundle.js'),
    });

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('about:blank');

    const result = await page.evaluate(`
      ${code}
      window.sampleTest();
    `);

    expect(result).toEqual(3);

    await browser.close();
  });
});
