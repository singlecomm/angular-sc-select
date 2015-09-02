'use strict';

module.exports = {
  entry: __dirname + '/demo.js',
  devtool: 'cheap-module-eval-source-map',
  output: {
    filename: 'bundle.js'
  },
  module: {
    preLoaders: [{
      test: /.*\.js$/,
      loaders: ['eslint'],
      exclude: /node_modules/
    }],
    loaders: [{
      test: /\.js$/,
      loaders: ['babel'],
      exclude: /node_modules/
    }, {
      test: /\.css/,
      loaders: ['style', 'css']
    }]
  },
  devServer: {
    port: 8000,
    inline: true
  }
};