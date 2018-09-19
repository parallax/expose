let mix = require('laravel-mix')

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */
mix.extend('excludeExpose', config => {
    config.module.rules[4].exclude = /(node_modules|bower_components|expose-react)/
})

mix.preact(
    'resources/js/app.js',
    'public/js'
).excludeExpose() /*.webpackConfig({
    resolve: {
        alias: {
            react: 'preact-compat',
            'react-dom': 'preact-compat'
        }
    }
})*/
