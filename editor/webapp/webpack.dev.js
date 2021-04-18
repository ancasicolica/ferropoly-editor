const {merge}           = require('webpack-merge');
const common            = require('./webpack.common.js');
const path              = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(common, {
  mode     : 'development',
  devtool  : 'inline-source-map',
  devServer: {
    contentBase: './dist'
  },
  resolve  : {
    alias: {
      vue: 'vue/dist/vue.js'
    },
  },
  plugins  : [
    new HtmlWebpackPlugin({
      chunks    : ['pricelist'],
      filename  : path.join(__dirname, '..', 'public', 'html', 'pricelist.html'),
      publicPath: '/js/test/',
      template  : path.join(__dirname, '..', 'html', 'pricelist.html'),
      minify    : false
    })
  ]
});
