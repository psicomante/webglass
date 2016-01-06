import typescript from 'rollup-plugin-typescript';
import * as ts from 'typescript';

export default {
  entry: 'src/webglass.ts',
  format: 'iife',
  dest: 'dist/webglass.rollup.js',
  moduleName: 'Webglass',
  plugins: [
    typescript({
      target: ts.ScriptTarget.ES6
    })
  ]
}
