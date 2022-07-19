import { IBaseType } from '@ekp-infra/common/dist/types'
import { IOrgElement } from '@ekp-infra/common/dist/types'

/*模板定义*/
export interface ICmsProjectSelectInfoTemplate extends IBaseType {
  //模板名称
  fdName: string
  //模板编码
  fdCode: string
  //创建人
  fdCreator: Partial<IOrgElement>
  //创建时间
  fdCreateTime: number
  //状态
  fdEnable: boolean
  //模板描述
  fdDesc: string
  //机制数据
  mechanisms: any
}
