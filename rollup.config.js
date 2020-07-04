import resolve from '@rollup/plugin-node-resolve';
import rollupJson from 'rollup-plugin-json';

export default {
  input: 'src/procyon.js',
  output: {
    inlineDynamicImports: true,
    dir: 'dist',
    name: 'procyon',
    format: 'es',
  },
  plugins: [
    resolve({ jsnext: true, preferBuiltins: true, browser: true }),
    rollupJson(),
  ],
};
