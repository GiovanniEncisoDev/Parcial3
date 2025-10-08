// rollup.config.js
import { terser } from "rollup-plugin-terser";

export default {
  input: 'index-entry.js',
  output: {
    file: 'dist/bundle.js',
    format: 'umd',      // UMD para poder usarlo con <script> en navegadores
    name: 'MiLib',      // nombre global (window.MiLib)
    sourcemap: false
  },
  plugins: [
    terser() // minifica antes de ofuscar
  ]
};
