const { join, resolve } = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { settings, themes } = require('../configuration');

let pathy = resolve(join(settings.source_path, themes.default));

console.log("themes", themes);
console.log("settings:", settings);
console.log("pathy:", pathy);

module.exports = {
  test: /\.s?css$/i,
  use: [
    // 'style-loader',
    MiniCssExtractPlugin.loader,
    {
      loader: 'css-loader',
      options: {
        sourceMap: true,
        importLoaders: 2,
        modules: true,
        // localIdentName: '[name]',
      },
    },
    {
      loader: 'postcss-loader',
      options: {
        sourceMap: true,
      },
    },
    {
      loader: 'sass-loader',
      options: {
        implementation: require('sass'),
        sourceMap: true,
      },
    },
    {
      loader: 'sass-resources-loader',
      options: {
        resources: [
          pathy,
        ]
      },
    },
  ],
};
