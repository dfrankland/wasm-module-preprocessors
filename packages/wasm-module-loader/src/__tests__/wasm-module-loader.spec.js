import { resolve as resolvePath } from 'path';
import webpack from 'webpack';
import puppeteer from 'puppeteer';

const webpackConfig = {
  entry: resolvePath(__dirname, './__fixtures__/main.js'),
  output: {
    path: resolvePath(__dirname, '../../build'),
    filename: './bundle.js',
  },
  devtool: 'inline-source-map',
  resolveLoader: {
    alias: {
      'wasm-module-loader': require.resolve('../'),
    },
  },
  module: {
    rules: [
      {
        test: /\.wasm?$/,
        use: [{ loader: 'wasm-module-loader' }],
      },
    ],
  },
};

const compiler = webpack(webpackConfig);

describe('wasm-module-loader', () => {
  it('compiles wasm binary to WebAssembly module instance', async () => {
    const bundle = await new Promise((resolve, reject) => {
      compiler.run((err, stats) => {
        console.log(stats.toString()); // eslint-disable-line no-console
        return stats.compilation.errors.length ?
          reject((
            new Error(stats.compilation.errors)
          )) :
          resolve((
            stats.compilation.assets[webpackConfig.output.filename].source()
          ));
      });
    });

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('about:blank');

    const result = await page.evaluate(`
      ${bundle}
      window.factorialTest(10);
    `);

    expect(result).toEqual(3628800);

    await browser.close();
  });
});
