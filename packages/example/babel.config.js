module.exports = {
  presets: [
    "@babel/preset-react",
    [
      "@babel/preset-env",
      {
        targets: {
          chrome: 70,
          edge: 18,
          firefox: 64,
          safari: 12,
        },
        loose: false,
        useBuiltIns: "usage",
        corejs: 3,
      },
    ],
  ],
  plugins: [],
};
