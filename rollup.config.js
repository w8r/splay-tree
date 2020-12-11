
import typescript from 'rollup-plugin-typescript2';

import {
  version, author,
  module as esmBundle,
  main as umdBundle,
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
    file: esmBundle,
    sourcemap: true
  },
  plugins: [typescript({ outDir: "dist", module: 'es2015' })]
}, {
  input: './src/index.ts',
  output: {
    name, banner,
    format: 'umd',
    file: umdBundle,
    sourcemap: true
  },
  plugins: [typescript({
    tsconfigOverride: {
      compilerOptions: { outDir: "dist" }
    }
  })]
}];
