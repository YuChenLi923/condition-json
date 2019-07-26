const path = require('path'),
      UglifyJsPlugin = require('uglifyjs-webpack-plugin'),
      fileName = 'condition-json.min',
      libraryName = 'cjson';
module.exports = {
  mode: 'production',
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: {
            drop_debugger: true
          },
          output:{
            comments: false
          }
        },
        parallel: true
      })
    ]
  },
  entry: path.resolve(__dirname, '../src/index.js'),
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: fileName + '.js',
    library: libraryName,
    libraryTarget: 'umd',
    globalObject: 'this'
  },
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
