import { merge } from 'webpack-merge'
import { resolve } from 'path'
import devConfig from './webpack.dev'

const prodConfig = merge(devConfig, {
  module: {
    rules: [
     
    ],
  },
})

export default prodConfig
