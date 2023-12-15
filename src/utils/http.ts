// http实例
import { Http } from '@ekp-infra/common'
const sysAuthHttp = Http.build({ modulePrefixName: 'sys-auth' })
const sysLbpmHttp = Http.build({ modulePrefixName: 'sys-lbpm' })
const cmsLbpaHttp = Http.build({ modulePrefixName: 'cms-lbpa' })
const cmsHttp = Http.build({ modulePrefixName: 'cms-out-manage' })
export { sysAuthHttp,sysLbpmHttp,cmsHttp,cmsLbpaHttp }
export default Http.build({ modulePrefixName: 'cms-out-manage' })

