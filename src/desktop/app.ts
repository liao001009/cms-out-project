// fake runtime
import { mountModule } from '@ekp-runtime/module'
import '@elements-toolkit/scss/app.scss'

const moduleName = process.env.moduleName || ''
const platform = process.env.platform as any

mountModule({ moduleName, platform, fdName: 'cms-out-project' })
