'use strict';

var karma = require('karma');

var server = new karma.Server({
  configFile: __dirname + '/karma.conf.js',
  autoWatch: true,
  singleRun: false
});

server.start();

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
      loaders: ['ng-annotate', 'babel'],
      exclude: /node_modules/
    }, {
      test: /\.css/,
      loaders: ['style', 'css']
    }, {
      test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: 'url-loader?limit=10000&mimetype=application/font-woff'
    }, {
      test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: 'file-loader'
    }, {
      test: /\.(png|gif)$/,
      loader: 'url-loader?limit=8192'
    }]
  },
  devServer: {
    port: 8000,
    inline: true
  }
};
