import type webpack from 'webpack'
import { join } from 'path'
import { STYLE_EXTENSISONS, SCRIPT_EXTENSISONS, CWD, EXAMPLE_TEMPLATE_PATH } from './constant'
import HtmlWebpackPlugin from 'html-webpack-plugin'
const CopyPlugin = require('copy-webpack-plugin')
const path = require('path')
const root = process.cwd()
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const isDev = process.env.NODE_ENV === 'dev'
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const loader = isDev ? 'style-loader' : MiniCssExtractPlugin.loader
export type WebpackConfig = webpack.Configuration

export type Env = 'dev' | 'test' | 'pre' | 'prod'

const setPlugins = (): webpack.WebpackPluginInstance[] => {
  return [
    new HtmlWebpackPlugin({
      chunks: ['design'],
      template: join(EXAMPLE_TEMPLATE_PATH, '.public', 'design.html'),
      filename: 'design.html',
      hash: false,
      env: 'dev',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
      },
    }),
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(path.resolve(root, './src'), '.public/'),
          to: 'static/',
        },
        {
          from: path.resolve(path.resolve(root, './src'), 'manifest.json'),
          to: 'manifest.json',
        },
      ],
    }),
  ]
}

export const baseConfig: WebpackConfig = {
  mode: 'development',
  entry: {
    example: join(EXAMPLE_TEMPLATE_PATH, 'app', 'index.tsx'),
    content: path.resolve(root, './src/content'),
    background: path.resolve(root, './src/background'),
    inject: path.resolve(root, './src/inject'),
  },
  resolve: {
    extensions: [...SCRIPT_EXTENSISONS, ...STYLE_EXTENSISONS],
    fallback: { crypto: false },
    alias: {
      '~': path.resolve(root, './src'),
    },
  },
  output: {
    path: join(CWD, 'dist'),
    publicPath: './',
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.(js|ts|jsx|tsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1024,
              include: path.resolve(root, './src'),
              name: 'images/[path][name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.css$/,
        sideEffects: true,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/,
        // include: dirs.src,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'thread-loader' },
          {
            loader: 'css-loader',
            options: {
              importLoaders: true,
              modules: {
                localIdentName: '[local]__[name]-[hash:base64:4]',
              },
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.less$/,
        sideEffects: true,
        use: ['style-loader', 'css-loader', 'less-loader'],
      },
    ],
  },
  plugins: setPlugins(),
}
