const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin')

module.exports = {
  // put sourcemaps inline
  devtool: 'eval',

  // entry point of the application:
  entry: ['babel-polyfill', 'index.tsx'],

  // configure the output directory and publicPath for the devServer
  output: {
    filename: '[name].[hash]_bundle.js',
    chunkFilename: '[name].[chunkhash]_bundle.js',
    publicPath: '/',
    path: path.resolve('dist')
  },

  // configure the dev server to run
  devServer: {
    port: 8080,
    historyApiFallback: {
      disableDotRule: true
    },
    inline: true
  },

  // tell Webpack to load TypeScript files
  resolve: {
    // Look for modules in .ts(x) files first, then .js
    extensions: ['.ts', '.tsx', '.js'],

    // add 'src' to the modules, so that when you import files you can do so with 'src' as the relative route
    modules: ['src', 'node_modules']
  },

  module: {
    loaders: [
      // .ts(x) files should first pass through the Typescript loader, and then through babel
      {
        test: /\.tsx?$/,
        use: ['babel-loader', 'awesome-typescript-loader'],
        include: path.resolve('src')
      },
      {
        test: /\.(scss|css)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader']
        })
      }
    ]
  },
  node: {
    fs: 'empty',
    tls: 'empty'
  },
  plugins: [
    new webpack.NamedChunksPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.ejs'
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: process.env.ANALYZER_MODE || 'disabled'
    }),
    new ExtractTextPlugin({
      filename: 'styles.css',
      allChunks: true
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity
    }),
    new InlineManifestWebpackPlugin({
      name: 'webpackManifest'
    }),
    new webpack.DefinePlugin({
      'process.env.DEPLOY_ENV': JSON.stringify('staging')
    })
  ]
}