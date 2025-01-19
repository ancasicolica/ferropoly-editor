const {merge}               = require('webpack-merge');
const common                = require('./webpack.common.js');
const path                  = require('path');
const BundleAnalyzerPlugin  = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const HtmlWebpackPlugin     = require('html-webpack-plugin');
const ferropolyApps         = require('./ferropolyApps.js');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const webpack           = require('webpack');

// Build the webpack list
let plugins = [
  new BundleAnalyzerPlugin({analyzerMode: 'static', reportFilename: 'report.html'}),
  new FaviconsWebpackPlugin(path.join(__dirname, 'favicon.png'))
];
ferropolyApps.forEach(app => {
  plugins.push(new HtmlWebpackPlugin(({
    chunks    : [`${app.name}`],
    template  : path.join(__dirname, 'html', app.htmlFile),
    filename  : path.join(__dirname, '..', 'editor', 'public', 'html', app.htmlFile),
    publicPath: '/build/',
    minify    : true
  })));

  plugins.push(  new webpack.DefinePlugin({
    __VUE_OPTIONS_API__  : true,
    __VUE_PROD_DEVTOOLS__: false,
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false
  }))
});

module.exports = merge(common, {
  mode   : 'production',
  //devtool: 'source-map',
  output : {
    filename     : '[name].min.js',
    chunkFilename: '[name].bundle.js',
    path    : path.resolve(__dirname, '..', 'editor', 'public', 'build')
  },
  stats  : {
    preset  : 'normal',
    children: true
  },
  optimization: {
    splitChunks: {
      chunks                : 'all',
      minSize               : 30000,
      maxSize               : 180000,
      minChunks             : 1,
      maxAsyncRequests      : 20,
      maxInitialRequests    : 5,
      automaticNameDelimiter: '-',
      cacheGroups           : {
        vendors: {
          test    : /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks         : 2,
          priority          : -20,
          reuseExistingChunk: false
        }
      }
    }
  },
  plugins     : plugins
});
