
import typescript from 'rollup-plugin-typescript2';
import buble from 'rollup-plugin-buble';

import { 
  version, author, 
  name as moduleName, license, description
} from './package.json';

const banner = `\
/**
 * ${moduleName} v${version}
 * ${description}
 *
 * @author ${author}
 * @license ${license}
 * @preserve
 */
`;

const name = 'SplayTree';

export default [{
  input: './src/index.ts',
  output: {
    name, banner,
    format: 'es',
    file: 'dist/splay.es6.js',
    sourcemap: true
  },
  plugins: [typescript()]
}, {
  input: './src/index.ts',
  output: {
    name, banner,
    format: 'umd',
    file: 'dist/splay.js',
    sourcemap: true
  },
  plugins: [typescript(), buble()]
}];
