module.exports = {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials"],
  webpackFinal: async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    const rules = config.module.rules.filter((r) => {
      // Remove existing css loader
      return !r.test.test("file.css");
    });

    // Make whatever fine-grained changes you need
    rules.push({
      test: /\.css$/i,
      use: ["style-loader", "css-loader", "postcss-loader"],
    });
    config.module.rules = rules;

    // Return the altered config
    return config;
  },
};
