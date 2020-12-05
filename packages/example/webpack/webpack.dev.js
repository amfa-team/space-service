const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const { merge } = require("webpack-merge");
const commonPaths = require("./common-paths");
const common = require("./webpack.common");

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;
const protocol = process.env.HTTPS === "true" ? "https" : "http";
const host = process.env.HOST || "localhost";

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    writeToDisk: true,
    hot: true,
    liveReload: false,
    contentBase: commonPaths.outputPath,
    publicPath: commonPaths.outputPath,
    host,
    https: protocol === "https",
    port: DEFAULT_PORT,
    disableHostCheck: true,
    historyApiFallback: true,
    watchContentBase: true,
    overlay: {
      error: true,
    },
    stats: {
      colors: true,
      chunks: false,
      "errors-only": true,
      warningsFilter: [/Failed to parse source map/],
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: `${commonPaths.contentBasePath}/index.html`,
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
});
