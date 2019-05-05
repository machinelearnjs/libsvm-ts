'use strict';

const path = require('path');

module.exports = {
  entry: ['./build/index.js'],
  output: {
    path: path.join(__dirname, '../dist/browser/wasm'),
    filename: 'libsvm.js',
    library: 'libsvm',
    libraryTarget: 'umd'
  },
  node: {
    fs: 'empty',
    crypto: 'empty',
    process: 'mock',
    Buffer: false,
    path: 'empty'
  }
};
