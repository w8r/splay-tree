
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
  input:     'index.js',
  output: {
    name, banner,
    format: 'es',
    file: 'dist/splay.es6.js',
    sourcemap: true
  }
}, {
  input:     'index.js',
  output: {
    name, banner,
    format: 'umd',
    file: 'dist/splay.js',
    sourcemap: true
  },
  plugins: [buble()]
}];
