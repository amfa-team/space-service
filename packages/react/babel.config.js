module.exports = {
  presets: [
    "@babel/preset-react",
    [
      "@babel/preset-env",
      {
        loose: false,
        useBuiltIns: "usage",
        corejs: 3,
      },
    ],
  ],
  plugins: [["@babel/plugin-proposal-class-properties", { loose: true }]],
};
