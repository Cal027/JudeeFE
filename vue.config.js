const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const VueFilenameInjector = require('@d2-projects/vue-filename-injector')
const ThemeColorReplacer = require('webpack-theme-color-replacer')
const forElementUI = require('webpack-theme-color-replacer/forElementUI')
const CompressionWebpackPlugin = require('compression-webpack-plugin')

const glob = require('glob')
const titles = require('./title.js')
const isProduction = process.env.NODE_ENV === 'production'

const cdn = {
  css: [
    'https://cdn.bootcss.com/element-ui/2.13.0/theme-chalk/index.css'
  ],
  js: [
    'https://cdn.bootcss.com/vue/2.6.11/vue.runtime.min.js',
    'https://cdn.bootcss.com/vue-router/3.1.3/vue-router.min.js',
    'https://cdn.bootcss.com/vuex/3.1.3/vuex.min.js',
    'https://cdn.bootcss.com/axios/0.18.1/axios.min.js',
    'https://cdn.bootcss.com/element-ui/2.13.0/index.js'
  ]
}

// 拼接路径
const resolve = dir => require('path').join(__dirname, dir)

// 基础路径 注意发布之前要先修改这里
let publicPath = process.env.VUE_APP_PUBLIC_PATH || '/'

// 增加环境变量
process.env.VUE_APP_VERSION = require('./package.json').version
process.env.VUE_APP_BUILD_TIME = require('dayjs')().format('YYYY-M-D HH:mm:ss')

// 统一配置多页
const pages = {}
glob.sync('./src/pages/**/main.js').forEach((filePath) => {
  let chunk = filePath.split('./src/pages/')[1].split('/main.js')[0]
  const chunkFirstName = chunk.split('/')[0]
  if (chunkFirstName === 'user') {
    chunk += '/index'
  }
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
  publicPath,
  lintOnSave: true,
  outputDir: './dist',
  productionSourceMap: false,
  devServer: {
    port: 8999,
    // publicPath,
    proxy: {
      '/api': {
        target: 'https://www.fastmock.site/mock/6c453883945216292945f471a2264433/judee',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    } // 配置开发环境 URL 便于本地开发调试
  },
  css: {
    extract: true,
    sourceMap: false,
    loaderOptions: {
      // 设置 scss 公用变量文件
      sass: {
        prependData: `@import '~@/assets/style/public.scss';`
      }
    }
  },
  chainWebpack: (config) => {
    config.plugins
     .delete('prefetch')
     .delete('preload')
    config.resolve
     .symlinks(true)
    config
     .plugin('theme-color-replacer')
     .use(ThemeColorReplacer, [{
       fileName: 'css/theme-colors.[contenthash:8].css',
       matchColors: [
         ...forElementUI.getElementUISeries(process.env.VUE_APP_ELEMENT_COLOR) // Element-ui主色系列
       ],
       externalCssFiles: ['./node_modules/element-ui/lib/theme-chalk/index.css'], // optional, String or string array. Set external css files (such as cdn css) to extract colors.
       changeSelector: forElementUI.changeSelector
     }])
    config.resolve.alias
     .set('@oj', resolve('src/pages/index'))
     .set('@admin', resolve('src/pages/admin'))
     .set('@api', resolve('src/api'))
    config
     // 开发环境
     .when(process.env.NODE_ENV === 'development',
      // sourcemap不包含列信息
      config => config.devtool('cheap-source-map')
     )
     // TRAVIS 构建 vue-loader 添加 filename
     .when(process.env.VUE_APP_SCOURCE_LINK === 'TRUE',
      VueFilenameInjector(config, {
        propName: process.env.VUE_APP_SOURCE_VIEWER_PROP_NAME
      })
     )
    // markdown
    config.module
     .rule('md')
     .test(/\.md$/)
     .use('text-loader')
     .loader('text-loader')
     .end()
    // svg
    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
     .include
     .add(resolve('src/assets/svg-icons/icons'))
     .end()
     .use('svg-sprite-loader')
     .loader('svg-sprite-loader')
     .options({
       symbolId: 'd2-[name]'
     })
     .end()
    // image exclude
    const imagesRule = config.module.rule('images')
    imagesRule
     .test(/\.(png|jpe?g|gif|webp|svg)(\?.*)?$/)
     .exclude
     .add(resolve('src/assets/svg-icons/icons'))
     .end()
    // 分析工具
    if (process.env.npm_config_report) {
      config
       .plugin('webpack-bundle-analyzer')
       .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
    }
    // 生产环境注入cdn + 多页面
    if (isProduction) {
      glob.sync('./src/pages/**/main.js').forEach(path => {
        const chunk = path.split('./src/pages/')[1].split('/main.js')[0]
        config.plugin('html-' + chunk).tap(args => {
          args[0].cdn = cdn
          return args
        })
      })
    }
  },
  // i18n
  pluginOptions: {
    i18n: {
      locale: 'zh-chs',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: true
    }
  },
  configureWebpack: config => {
    const plugins = [
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true,
            warnings: false,
            unused: true
          }
        },
        sourceMap: false,
        cache: true,
        exclude: /\.min\.js$/,
        parallel: true,
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
          minSize: 0,
          priority: 1,
          chunks: 'initial',
          reuseExistingChunk: true
        }
      }
    }
    if (isProduction) {
      config.plugins = [...config.plugins, ...plugins, new CompressionWebpackPlugin({
        filename: '[path].gz[query]',
        test: new RegExp('\\.(' + ['js', 'css'].join('|') + ')$'),
        threshold: 10240,
        minRatio: 0.8,
        deleteOriginalAssets: false
      })]
      config.optimization.splitChunks = splitChunksConfig
      config.externals = {
        'vue': 'Vue',
        'vuex': 'Vuex',
        'vue-router': 'VueRouter',
        'axios': 'axios',
        'element-ui': 'ELEMENT'
      }
    }
  }
}
