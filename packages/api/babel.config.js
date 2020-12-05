module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          node: "12.10",
        },
        loose: false,
        bugfixes: true,
      },
    ],
  ],
};
