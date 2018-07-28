/* code adapted from webpack-suite project: https://github.com/axe312ger/metalsmith-webpack-suite */

const path = require('path')
const Webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const WriteFilePlugin = require('write-file-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin');

const __DEV__ = process.env.NODE_ENV !== 'production'
const __PROD__ = process.env.NODE_ENV === 'production'

const config = {
  entry: {
    immediate: path.join(__dirname, 'src', 'assets', 'js', 'immediate.js'),
    page: path.join(__dirname, 'src', 'assets', 'js', 'page.js'),
    layout: path.join(__dirname, 'src', 'assets', 'scss', 'layout.scss')
  },
  devtool: __DEV__ ? '#cheap-module-eval-source-map' : false,
  output: {
    path: path.resolve(__dirname,'build','assets'),
    publicPath: '/assets',
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader'
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
            use: [{
                loader: "css-loader"
            }, {
                loader: "sass-loader"
            }],
            // use style-loader in development
            fallback: "style-loader"
        })
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: 'layout.css',
      allChunks: true
    }),
    new CleanWebpackPlugin(['build/assets'])
  ]
}

if (__DEV__) {
  config.plugins.push(new Webpack.LoaderOptionsPlugin({
    debug: true
  }))
  // Force webpack-dev-middleware to write files to the disk for metalsmith
  config.plugins.push(new WriteFilePlugin({
    log: false
  }))
}

if (__PROD__) {
  config.plugins.push(new Webpack.LoaderOptionsPlugin({
    minimize: true
  }))
  config.plugins.push(new Webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify('production')
    }
  }))
  config.plugins.push(new Webpack.optimize.AggressiveMergingPlugin())
  config.plugins.push(new Webpack.optimize.UglifyJsPlugin())
}

module.exports = config
