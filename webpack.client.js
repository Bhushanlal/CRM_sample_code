const path = require('path');
const webpack = require('webpack')
const dotenv = require('dotenv') // >> when process is undefined
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'development',
  target: 'web', // most impportant thing >> when global is undefined
  entry: './client.js',
  output: {
    filename: "client_bundle.js",
    path: path.resolve(__dirname, 'build/public'),
    publicPath: '/build/public'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: '/node_modules/',
        options: {
          presets: [
            "@babel/preset-env", "@babel/preset-react"
          ],
        },
      },
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader'
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|tiff|ico)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
              publicPath: '/'
            }
          }
        ]
      },
    ]
  },
  resolve: {
    extensions: ['.mjs', '.js', '.jsx', '.css']
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(dotenv.config().parsed)
    }),
    new MiniCssExtractPlugin()
  ],
}
