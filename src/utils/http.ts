// http实例
import { Http } from '@ekp-infra/common'
const basedataHttp = Http.build({ modulePrefixName: 'cms-out-basedata' })

export { basedataHttp }
export default Http.build({ modulePrefixName: 'cms-out-project' })

