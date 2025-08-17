/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const { stylePaths } = require('./stylePaths');
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || '9000';

module.exports = merge(common('development'), {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    host: HOST,
    port: PORT,
    historyApiFallback: true,
    open: true,
    static: [
      // Serve static assets (e.g., /silent-check-sso.html) from /public at the app origin
      {
        directory: path.resolve(__dirname, 'public'),
        publicPath: '/',
        watch: true,
      },
      // Keep /dist as a secondary static directory if you have assets there
      {
        directory: path.resolve(__dirname, 'dist'),
      },
    ],
    client: {
      overlay: true,
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        include: [...stylePaths],
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
});
