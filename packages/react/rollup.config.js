import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import postCssValues from "postcss-modules-values";
import polyfill from "rollup-plugin-polyfill";
import postcss from "rollup-plugin-postcss";
import sourcemaps from "rollup-plugin-sourcemaps";
import pkg from "./package.json";

export const extensions = [".js", ".jsx", ".ts", ".tsx"];

export default [
  {
    input: "lib/index.js",
    output: [
      {
        file: pkg.module,
        format: "es",
        sourcemap: true,
      },
    ],
    plugins: [
      resolve({
        extensions,
        browser: true,
        preferBuiltins: false,
        modulesOnly: true,
        resolveOnly: [/^@amfa-team\/space-service.*$/],
      }),
      sourcemaps(),
      postcss({
        extract: true,
        minimize: !process.env.ROLLUP_WATCH,
        sourceMap: true,
        plugins: [postCssValues],
      }),
      babel({
        babelHelpers: "runtime",
        extensions,
        plugins: [["@babel/plugin-transform-runtime", { useESModules: true }]],
      }),
      polyfill(["abortcontroller-polyfill"]),
    ],
  },
  {
    input: "lib/index.js",
    output: [
      {
        file: pkg.main,
        format: "cjs",
        sourcemap: true,
      },
    ],
    plugins: [
      resolve({
        extensions,
        browser: true,
        preferBuiltins: false,
        modulesOnly: true,
        resolveOnly: [/^@amfa-team\/space-service.*$/],
      }),
      sourcemaps(),
      postcss({
        extract: true,
        minimize: !process.env.ROLLUP_WATCH,
        sourceMap: true,
        plugins: [postCssValues],
      }),
      babel({
        babelHelpers: "runtime",
        extensions,
        plugins: [["@babel/plugin-transform-runtime", { useESModules: false }]],
      }),
      polyfill(["abortcontroller-polyfill"]),
    ],
  },
];
