const {merge}              = require('webpack-merge');
const common               = require('./webpack.common.js');
const path                 = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const HtmlWebpackPlugin    = require('html-webpack-plugin');

module.exports = merge(common, {
  mode   : 'production',
  devtool: 'source-map',
  output : {
    filename     : '[name].min.js',
    chunkFilename: '[name].bundle.js',
    path         : path.resolve(__dirname, '..', 'public', 'js', 'build')
    //path: path.resolve(__dirname, 'www', 'js')
  },
  stats  : {
    preset: 'normal',
    children: true
  },

  optimization: {
    splitChunks: {
      chunks                : 'all',
      minSize               : 30000,
      maxSize               : 250000,
      minChunks             : 1,
      maxAsyncRequests      : 1,
      maxInitialRequests    : 1,
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
  plugins     : [
    new BundleAnalyzerPlugin({analyzerMode: 'static', reportFilename: 'report.html'}),
    new HtmlWebpackPlugin({
      chunks  : ['pricelist'],
      filename  : path.join(__dirname, '..', 'public', 'html', 'pricelist.html'),
      publicPath: '/js/build/',
      template  : path.join(__dirname, '..', 'html', 'pricelist.html'),
      minify  : true
    })
  ]
});
