const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
// 打包分析工具，可选用
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// sentry 接入，可选用
// const SentryPlugin = require('@tencent/webpack-sentry-plugin');

const glob = require('glob')
const titles = require('./title.js')
const path = require('path');
function resolve (dir) {
    return path.join(__dirname, dir)
}

// 统一配置多页
const pages = {}
glob.sync('./src/pages/**/main.js').forEach((filePath) => {
    let chunk = filePath.split('./src/pages/')[1].split('/main.js')[0]
    const chunkFirstName = chunk.split('/')[0]
    if (chunkFirstName === 'user') {
        chunk += '/index'
    }
    // console.log(chunk)
    pages[chunk] = {
        entry: filePath,
        template: 'public/index.html',
        title: titles[chunk],
        chunks: ['chunk-vendors', 'chunk-common', chunk]
    }
})
console.log('process.env.NODE_ENV ==' + process.env.NODE_ENV)
module.exports = {
    pages,
    lintOnSave: true,
    outputDir: './dist',
    productionSourceMap: !(process.env.NODE_ENV === 'production'),
    devServer: {
        port: 8999,
        proxy: {
            '/api': {
                target: 'http://cs308.leeeung.com:8300/',
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '/'
                }
            }
        } // 配置开发环境 URL 便于本地开发调试
    },
    chainWebpack: (config) => {
        config.plugins.delete('named-chunks')
        config.externals({
            'CKEDITOR': 'window.CKEDITOR'
        })
        config.resolve.alias
            .set('@oj',resolve('src/pages/index'))
            .set('@admin',resolve('src/pages/admin'))
    },
    configureWebpack: (config) => {
        const plugins = [
            new UglifyJsPlugin({
                uglifyOptions: {
                    compress: {
                        drop_console: true
                    }
                },
                sourceMap: true
            })
        ]
        // splitChunk 配置
        const splitChunksConfig = {
            cacheGroups: {
                vendors: {
                    name: 'chunk-vendors',
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    chunks: 'initial',
                    minChunks: 2
                },
                common: {
                    name: 'chunk-common',
                    minChunks: 2,
                    priority: -20,
                    chunks: 'initial',
                    reuseExistingChunk: true
                }
            }
        }
        if (process.env.NODE_ENV === 'production') {
            config.plugins = [...config.plugins, ...plugins]
            config.optimization.splitChunks = splitChunksConfig
        }
    }
}
