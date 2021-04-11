const {merge}              = require('webpack-merge');
const common               = require('./webpack.common.js');
const path                 = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = merge(common, {
  mode   : 'production',
  devtool: 'source-map',
  plugins: [
    new BundleAnalyzerPlugin({analyzerMode: 'static', reportFilename: 'report.html'})
  ],
  output : {
    filename     : '[name].min.js',
    chunkFilename: '[name].bundle.js',
    path    : path.resolve(__dirname, '..', 'public', 'js', 'build')
    //path: path.resolve(__dirname, 'www', 'js')
  },
  stats  : {
    preset: 'normal'
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
      name(module, chunks, cacheGroupKey) {
        const moduleFileName = module.identifier().split('/').reduceRight(item => item);
        const allChunksNames = chunks.map((item) => item.name).join('~');
        return `${cacheGroupKey}-${allChunksNames}-${moduleFileName}`;
      },
      cacheGroups: {
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
  }
});
