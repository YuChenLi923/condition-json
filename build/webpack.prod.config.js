const path = require('path'),
      fileName = 'condition-json',
      libraryName = 'cjson';
module.exports = {
  optimization: {
    minimize: false
  },
  entry: path.resolve(__dirname, '../src/index.js'),
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: fileName + '.js',
    library: libraryName,
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  mode: 'production',
  module: {
    rules: [{
      test: /\.(js)$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader'
      }
    }]
  }
};
