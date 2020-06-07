const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    index: './src/index.js',
  },
  cache: false,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
  },

  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
      },
    },
    {
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [{
          loader: 'css-loader',
        }],
      }),
    },
    {
      test: /\.html$/,
      exclude: /node_modules/,
      use: {
        loader: 'html-loader',
      },
    },
    ],
  },

  resolve: {
    extensions: ['.js'],
  },

  mode: 'development',
  devtool: 'none',

  devServer: {
    hot: true,
  },

  plugins: [
    new ExtractTextPlugin({
      filename: './css/style.css',
    }),
    new HtmlWebpackPlugin({
      title: 'MaxShelepen',
      filename: 'index.html',
      template: 'index.html',
      chunks: ['index'],
    }),
    new CopyWebpackPlugin([
      {
        from: 'src/files/*',
        to: 'src/files/[name].[ext]',
      },
    ]),
    new OptimizeCssAssetsPlugin({
      cssProcessorPluginOptions: {
        preset: [
          'default',
          {
            discardComments: {
              removeAll: true,
            },
          },
        ],
      },
      canPrint: true,
    }),
  ],
};
