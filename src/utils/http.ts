// http实例
import { Http } from '@ekp-infra/common'
const sysAuthHttp = Http.build({ modulePrefixName: 'sys-auth' })
export { sysAuthHttp }
export default Http.build({ modulePrefixName: 'cms-out-manage' })

