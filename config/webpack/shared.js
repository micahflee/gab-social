// Note: You must restart bin/webpack-dev-server for changes to take effect

const webpack = require('webpack');
const { basename, dirname, join, relative, resolve } = require('path');
const { sync } = require('glob');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const AssetsManifestPlugin = require('webpack-assets-manifest');
const extname = require('path-complete-extname');
const { env, settings, output } = require('./configuration');
const rules = require('./rules');
const localePackPaths = [
  '/Users/m3/Documents/dev/gab-social/tmp/packs/locale_en.js',
];
//require('./generateLocalePacks');

const extensionGlob = `**/*{${settings.extensions.join(',')}}*`;
const entryPath = join(settings.source_path, settings.source_entry_path);
const packPaths = sync(join(entryPath, extensionGlob));

console.log("localePackPaths", localePackPaths);
console.log("packPaths:", packPaths);
console.log("env:", env);
console.log("settings:", settings);
console.log("output:", output);

module.exports = {
  entry: Object.assign(
    packPaths.reduce((map, entry) => {
      const localMap = map;
      const namespace = relative(join(entryPath), dirname(entry));
      localMap[join(namespace, basename(entry, extname(entry)))] = resolve(entry);
      return localMap;
    }, {}),
    localePackPaths.reduce((map, entry) => {
      const localMap = map;
      localMap[basename(entry, extname(entry, extname(entry)))] = resolve(entry);
      return localMap;
    }, {}),
  ),

  output: {
    filename: 'js/[name]-[chunkhash].js',
    chunkFilename: 'js/[name]-[chunkhash].chunk.js',
    hotUpdateChunkFilename: 'js/[id]-[hash].hot-update.js',
    path: output.path,
    publicPath: output.publicPath,
  },

  optimization: {
    runtimeChunk: {
      name: 'common',
    },
    splitChunks: {
      cacheGroups: {
        default: false,
        vendors: false,
        common: {
          name: 'common',
          chunks: 'all',
          minChunks: 2,
          minSize: 0,
          test: /^(?!.*[\\\/]node_modules[\\\/]react-intl[\\\/]).+$/,
        },
      },
    },
    occurrenceOrder: true,
  },

  module: {
    rules: Object.keys(rules).map(key => rules[key]),
  },

  plugins: [
    new webpack.ProvidePlugin({
      React: 'react',
      Component: ['react', 'Component'],
      PureComponent: ['react', 'PureComponent'],
      connect: ['react-redux', 'connect'],
      PropTypes: 'prop-types',
      _s: '/Users/m3/Documents/dev/gab-social/app/javascript/styles/global.css', // : todo :
    }),
    new webpack.EnvironmentPlugin(JSON.parse(JSON.stringify(env))),
    new webpack.NormalModuleReplacementPlugin(
      /^history\//, (resource) => {
        // temporary fix for https://github.com/ReactTraining/react-router/issues/5576
        // to reduce bundle size
        resource.request = resource.request.replace(/^history/, 'history/es');
      }
    ),
    new MiniCssExtractPlugin({
      filename: 'css/[name]-[contenthash:8].css',
      chunkFilename: 'css/[name]-[contenthash:8].chunk.css',
      ignoreOrder: true,
    }),
    new AssetsManifestPlugin({
      integrity: false,
      entrypoints: true,
      writeToDisk: true,
      publicPath: true,
    }),
  ],

  resolve: {
    extensions: settings.extensions,
    modules: [
      resolve(settings.source_path),
      'node_modules',
    ],
  },

  resolveLoader: {
    modules: ['node_modules'],
  },

  node: {
    // Called by http-link-header in an API we never use, increases
    // bundle size unnecessarily
    Buffer: false,
  },
};
