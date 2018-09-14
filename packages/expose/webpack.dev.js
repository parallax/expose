let common = require('./webpack.common.js')
let merge = require('webpack-merge')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map'
})
