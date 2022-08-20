const path = require('path')
const { MkPlugin } = require('@lpack/boilerplate-generator-mk/lib/webpack/plugin')

// 标准EKP有三端: 桌面端(desktop)、管理端(manage)、移动端(mobile)
const entryName = process.env.NODE_TARGET || 'manage'
const moduleName = 'cms-out-project'

// lpack配置
/**
 * @type {import('@lpack/common').Config}
 */
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
    xAuthDebugger: 'caixy',
    // 模块名
    moduleName: moduleName,
    // 平台，desktop、manage、mobile
    platform: entryName,
    // 模块代理
    modulesUrlPrefix: 'http://192.168.50.145:7088/web',
    // 租户资源域名前缀
    tenantUrlPrefix: 'http://192.168.50.145:7088/web',
    // 组件库域名
    elementsUrlPrefix: {
      manufact: 'http://192.168.50.145:7088/web',
      artifact: 'http://192.168.50.145:7088/web'
      // artifact: 'http://127.0.0.1:8008'
    },
    // elementsUrlPrefix: 'http://127.0.0.1:8008',
    // 服务端域名
    apiUrlPrefix: 'http://192.168.50.145:7101/data',
    //多语言服务
    langUrlPrefix: 'http://192.168.50.145:7088/data/sys-lang'
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
