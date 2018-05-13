import buble      from 'rollup-plugin-buble';
import multiEntry from 'rollup-plugin-multi-entry';

export default {
  input:     'tests/**/*.test.js',
  plugins:   [buble(), multiEntry()],
  external:  [ 'mocha', 'chai' ],
  output: {
    intro:     'require("source-map-support").install();',
    file:      'build/tests-bundle.js',
    sourcemap: true,
    format:    'cjs',
  }
};
