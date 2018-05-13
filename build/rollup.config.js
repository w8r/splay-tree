import { version, author, name, license, description } from '../package.json';
const banner = `\
/**
 * ${name} v${version}
 * ${description}
 *
 * @author ${author}
 * @license ${license}
 * @preserve
 */
`;
export default {
  input:     'index.js',
  output: {
    name: 'SplayTree',
    banner,
  }
};
