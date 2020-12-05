// ////////////////////////////////////////////////////////
//  Common paths module (webpack.academy)
// ////////////////////////////////////////////////////////
//  author: Jose Quinto - https://blog.josequinto.com
// ////////////////////////////////////////////////////////

const { resolve } = require("path");
module.exports = {
  outputPath: resolve(__dirname, "../", "build"),
  contentBasePath: resolve(__dirname, "../", "public"),
  srcPath: resolve(__dirname, "../", "src"),
};
