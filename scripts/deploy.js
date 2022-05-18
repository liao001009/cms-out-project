const { deploy, runShellCmd } = require('deploy-toolkit')
const fs = require('fs-extra')
const path = require('path')
const ROOT_DIR = path.join(__dirname, '../')
const moduleName = 'demo'

function getServerSsh () {
  const branchName = process.env.CI_COMMIT_REF_NAME || 'daily'
  if (!/^(?:v.*\/)?(test|daily)$/.test(branchName)) {
    throw new Error(`
    --------- [deploy] --------
    this CI job only triggered on daily and test branch
        ${branchName} won't triggger deploy
    --------- [deploy] --------\n`)
  }

  const branch = RegExp.$1
  console.log(`[deploy] CI is going to deploy ${moduleName} to ${branch} environment\n`)
  return branch === 'daily' ?
    // 开发环境
    {
      host: '192.168.50.25',
      username: 'user',
      password: 'Landray123'
    } :
    // 测试环境
    {
      host: '192.168.50.41',
      username: 'user',
      password: 'Landray~123'
    }
}

async function main() {
  const ssh = getServerSsh()
  const cmdsConf = {
    log: true,
    cmds: [
      {
        type: 'cmd',
        args: ['rm', '-rf', `/usr/local/nginx/html/web/${moduleName}`],
        cwd: '~'
      },
      {
        type: 'upload',
        src: path.join(ROOT_DIR, 'dist.tar.gz'),
        dest: `/usr/local/nginx/html/web/${moduleName}.tar.gz`
      },
      {
        type: 'cmd',
        args: ['tar', '-xzf', `${moduleName}.tar.gz`, '-C', '.'],
        cwd: '/usr/local/nginx/html/web/'
      }
    ]
  }
  try {
    const config = Object.assign({ssh}, cmdsConf)
    await runShellCmd('tar', [
      '-czf',
      path.join(ROOT_DIR, 'dist.tar.gz'),
      '-C',
      path.join(ROOT_DIR, 'dist'),
      '.'
    ])
    await deploy(config)
    fs.removeSync(path.join(ROOT_DIR, 'dist.tar.gz'))
    fs.removeSync(path.join(ROOT_DIR, 'dist'))
  } catch (error) {
    console.error('Faile to delpoy server!', error)
    fs.removeSync(path.join(ROOT_DIR, 'dist'))
    fs.removeSync(path.join(ROOT_DIR, 'dist.tar.gz'))
    process.exit(1)
  }
}

main()
