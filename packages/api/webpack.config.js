const path = require("path");
const SentryWebpackPlugin = require("@sentry/webpack-plugin");
const slsw = require("serverless-webpack");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const webpack = require("webpack");
const nodeExternals = require("webpack-node-externals");

const plugins = [new webpack.WatchIgnorePlugin({ paths: [/\.d\.ts$/] })];

if (!slsw.lib.webpack.isLocal) {
  plugins.push(
    new SentryWebpackPlugin({
      authToken: process.env.SENTRY_AUTH_TOKEN,
      org: "side-by-side-sas",
      project: "space-service-api",
      include: `${__dirname}/.webpack`,
      urlPrefix: "/var/task",
      // debug: true,
    }),
  );
}

module.exports = {
  entry: slsw.lib.entries,
  mode: slsw.lib.webpack.isLocal ? "development" : "production",
  target: "node",
  devtool: slsw.lib.webpack.isLocal ? false : "source-map",
  optimization: {
    concatenateModules: false,
    minimize: false,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          "babel-loader",
          {
            loader: "ts-loader",
            options: {
              projectReferences: true,
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.jsx?$/,
        use: ["babel-loader"],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      "@amfa-team/space-service-types": path.resolve(__dirname, "../types/src"),
    },
    plugins: [new TsconfigPathsPlugin({ configFile: "./tsconfig.json" })],
  },
  plugins,
  externals: [
    nodeExternals({
      allowlist: [/^@amfa-team\//],
      additionalModuleDirs: [
        path.resolve(__dirname, "..", "..", "node_modules"),
      ],
    }),
  ],
  cache: false,
  stats: "minimal",
};
