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
  banner,
  entry:     'index.js',
  sourceMap: true
};
