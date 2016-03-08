const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, 'examples/index.js'),
  output: {
    path: path.resolve(__dirname, 'dev'),
    filename: 'bundle.js',
  },
  resolve: {
    modulesDirectories: ['node_modules'],
    extensions: ['', '.js'],
    root: [path.resolve(__dirname, 'src/')],
  },
  eslint: {
    configFile: path.resolve(__dirname, '.eslintrc'),
  },
  module: {
    loaders: [
      {
        loader: 'babel-loader',
        test: /\.js$/,
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [],
};
