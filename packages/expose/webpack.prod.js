let common = require('./webpack.common.js')
let merge = require('webpack-merge')

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map'
})
