import config from './rollup.config';
import buble  from 'rollup-plugin-buble';

config.format     = 'umd';
config.dest       = 'dist/splay.js';
config.moduleName = 'SplayTree';
config.plugins    = [ buble() ];

export default config;
