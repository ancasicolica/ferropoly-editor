const {merge}           = require('webpack-merge');
const common            = require('./webpack.common.js');
const path              = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ferropolyApps     = require('./ferropolyApps.js');
const webpack           = require('webpack');

// Build the webpack list
let plugins = [];
ferropolyApps.forEach(app => {
  console.log(__dirname);
  plugins.push(new HtmlWebpackPlugin(({
    chunks    : [`${app.name}`],
    template  : path.join(__dirname, 'html', app.htmlFile),
    filename  : path.join(__dirname, '..', 'editor', 'public', 'html', app.htmlFile),
    publicPath: '/js/test/',
    minify    : false
  })));

  plugins.push(  new webpack.DefinePlugin({
    __VUE_OPTIONS_API__  : true,
    __VUE_PROD_DEVTOOLS__: true,
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: true
  }))
});

module.exports = merge(common, {
  mode        : 'development',
  devtool     : 'inline-source-map',
  devServer   : {
    contentBase: './dist'
  },
  stats: {
    errorDetails: false
  },
  plugins:  plugins
});
