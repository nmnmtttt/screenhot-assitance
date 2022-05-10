import { merge } from 'webpack-merge'
import { resolve } from 'path'
import devConfig from './webpack.dev'

const preConfig = merge(devConfig, {
  module: {
    rules: [
     
    ],
  },
})

export default preConfig
