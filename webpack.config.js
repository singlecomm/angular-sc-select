'use strict';

module.exports = {
  entry: __dirname + '/src/entry.js',
  devtool: 'cheap-module-eval-source-map',
  output: {
    filename: 'angular-sc-select.js'
  },
  devServer: {
    port: 8000,
    inline: true
  }
};