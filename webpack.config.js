module.exports = {
  entry: './src/index.js',
  output: {
    path: './dist',
    filename: 'index.js',
  },
  loaders: [
    {
      test: /src\/.*\.js$/,
      loader: 'babel',
      query: {
        presets: ['es2015'],
        plugins: ['transform-object-rest-spread'],
      },
    },
  ],
};
