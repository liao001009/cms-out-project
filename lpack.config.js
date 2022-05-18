const path = require('path')
const { MkPlugin } = require('@lpack/boilerplate-generator-mk/lib/webpack/plugin')

// 标准EKP有三端: 桌面端(desktop)、管理端(manage)、移动端(mobile)
const entryName = process.env.NODE_TARGET || 'manage'
const moduleName = 'demo'

// lpack配置
const lpackConfig = {
  // 开发服务器端口
  // port: 3000,
  // 打包目录
  assetsRoot: path.join(__dirname, `dist/${moduleName}/${entryName}`),
  // 需打包模块
  entries: {
    // 模块入口，供全局runtime调用的入口
    index: {
      entry: path.join(__dirname, `./src/${entryName}/index.ts`),
      html: false
    },
    // 独立运行的入口
    app: {
      entry: path.join(__dirname, `./src/${entryName}/app.ts`),
      filename: 'index.html'
    }
  },
  // 变量，业务模块可通过process.env.xxx获取相关值
  variables: {
    // 开发环境模拟用户身份
    xAuthDebugger: 'jm',
    // 模块名
    moduleName: moduleName,
    // 平台，desktop、manage、mobile
    platform: entryName,
    // 模块代理
    modulesUrlPrefix: 'http://mktest.ywork.me/web',
    // 租户资源域名前缀
    tenantUrlPrefix: 'http://mktest.ywork.me/web',
    // 组件库域名
    elementsUrlPrefix: {
      manufact: 'http://mktest.ywork.me/web',
      artifact: 'http://mktest.ywork.me/web'
    },
    // 多语言服务域名
    langUrlPrefix: 'http://mktest.ywork.me/data/sys-lang',
    // 服务端域名
    apiUrlPrefix: 'http://api.landray.com.cn/mock/458/data'
    // apiUrlPrefix: 'https://mkdemo.landray.com.cn/data'
  },
  webpack: {
    resolve: {
      alias: {
        '@': path.join(__dirname, './src')
      }
    },
    plugins: [new MkPlugin()]
  }
}

// desktop端和mobile端提供api.ts供其它模块调用
if (entryName === 'desktop' || entryName === 'mobile') {
  lpackConfig.entries['api'] = {
    entry: path.join(__dirname, `./src/${entryName}/api.ts`),
    html: false
  }
}

module.exports = lpackConfig
