const CopyWebpackPlugin = require("copy-webpack-plugin");
const DotEnv = require("dotenv-webpack");
const { ProvidePlugin } = require("webpack");
const commonPaths = require("./common-paths");

const config = {
  target: "web",
  entry: {
    polyfills: "./src/polyfills.ts",
    index: "./src/index.tsx",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  output: {
    filename: "static/js/[name].[hash].js",
    path: commonPaths.outputPath,

    // There are also additional JS chunk files if you use code splitting.
    chunkFilename: "static/js/[name].chunk.js",

    // This is the URL that app is served from. We use "/" in development.
    publicPath: "/",
  },
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
  plugins: [
    new ProvidePlugin({ process: "process" }),
    new DotEnv({
      safe: true,
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: commonPaths.contentBasePath,
          globOptions: {
            dot: true,
            ignore: ["**/index.html"],
          },
        },
      ],
    }),
  ],
  module: {
    rules: [
      // Once TypeScript is configured to output source maps we need to tell webpack
      // to extract these source maps and pass them to the browser,
      // this way we will get the source file exactly as we see it in our code editor.
      {
        enforce: "pre",
        test: /\.(js|mjs|jsx|ts|tsx|css)$/,
        use: "source-map-loader",
      },
      {
        test: /\.ts(x?)$/,
        use: [
          "babel-loader",
          {
            loader: "ts-loader",
            options: {
              projectReferences: true,
              happyPackMode: true, // IMPORTANT! use happyPackMode mode to speed-up compilation and reduce errors reported to webpack
            },
          },
        ],
        include: commonPaths.srcPath,
        exclude: /node_modules/,
      },
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: "javascript/auto",
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
    ],
  },
  stats: {
    warningsFilter: [/Failed to parse source map/],
  },
};

module.exports = config;
