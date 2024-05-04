const path              = require('path');
const {VueLoaderPlugin} = require('vue-loader');
const ferropolyApps     = require('./ferropolyApps.js');
const webpack           = require('webpack');

module.exports = {
  entry  : function () {
    let retVal = {};
    ferropolyApps.forEach(app => {
      retVal[app.name] = app.entry;
    });
    return retVal;
  },
  output : {
    filename: '[name].js',
    path    : path.resolve(__dirname, '..', 'editor', 'public', 'js', 'test')
  },
  mode   : 'development',
  module : {
    rules: [
      {
        test  : /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test  : /\.pug$/,
        loader: 'pug-plain-loader'
      },
      {
        test: /\.css$/,
        use : ['style-loader', 'css-loader']
      },
      {
        test: /\.html$/i,
        use : 'raw-loader',
      },
      {
        test: /\.s[ac]ss$/i,
        use : [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      },
    ]
  },
  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm-bundler.js'
    },
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__  : true,
      __VUE_PROD_DEVTOOLS__: true,
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: true
    })

  ]
};
