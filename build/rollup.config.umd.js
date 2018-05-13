import config from './rollup.config';
import buble  from 'rollup-plugin-buble';

config.output.format     = 'umd';
config.output.file       = 'dist/splay.js';

config.plugins    = [ buble() ];

export default config;
