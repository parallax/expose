let mix = require('laravel-mix')
require('./vendor/parallax/laravel-js-views')

mix.extend('excludeExpose', config => {
    config.module.rules[4].exclude = /(node_modules|bower_components|expose-react)/
})

mix.views('preact').excludeExpose()
