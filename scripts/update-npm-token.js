const fs = require('fs')
const path = require('path')

function getVars() {
  const env = process.env
  const prefixReg = /^PNPM_/
  return Object.keys(env)
    .filter(key => prefixReg.test(key))
    .map(k => `${k.replace(prefixReg, '')} = ${env[k]}`)
    .join('\n')
}

function main() {
  const npmrcPath = path.join(__dirname, '../.npmrc')
  const content = getVars()
  fs.writeFileSync(npmrcPath, content, 'utf8')
}

main()
