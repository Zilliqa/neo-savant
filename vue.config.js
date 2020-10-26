const fs = require("fs");
const webpack = require("webpack");
const packageJson = fs.readFileSync("./package.json");
const version = JSON.parse(packageJson).version || 0;
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
  css: {
    loaderOptions: {
      scss: {
        prependData: `@import "@/styles/main.scss";`,
      },
    },
  },
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        "process.env": {
          PACKAGE_VERSION: '"' + version + '"',
        },
      }),
      new MonacoWebpackPlugin({
        languages: ['json']
      })
    ],
  },
  // the rest of your original module.exports code goes here
};
