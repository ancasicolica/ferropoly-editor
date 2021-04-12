const path              = require('path');
const {VueLoaderPlugin} = require('vue-loader');

module.exports = {
  entry  : {
    'game-selector': path.join(__dirname, 'game-selector', 'app.js'),
    'pricelist': path.join(__dirname, 'pricelist', 'app.js')
  },
  output : {
    filename: '[name].js',
    path    : path.resolve(__dirname, '..', 'public', 'js')
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
      }
    ]
  },
  resolve: {
    alias: {
      vue: 'vue/dist/vue.js'
    },
  },
  plugins: [
    new VueLoaderPlugin()
  ]
};
