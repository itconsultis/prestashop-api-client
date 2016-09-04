const fs = require('fs');
const babelcfg = JSON.parse(fs.readFileSync('.babelrc'));

module.exports = {
  entry: './src/index.js',
  output: {
    path: './dist',
    filename: 'index.js',
  },
  module: {
    loaders: [
      {
        test: /^src\/.*\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: babelcfg,
      },
    ],
  },
};
