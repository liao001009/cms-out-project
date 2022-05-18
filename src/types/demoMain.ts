import { IBaseType, IOrgElement } from '@ekp-infra/common/dist/types'
/**
 * 简单样例定义
 */
export interface IDemoMain extends IBaseType {
  /** 名称 */
  fdName: string
  /** 描述 */
  fdDesc?: string
  /** 排序号 */
  fdOrder?: number
  /** 创建时间 */
  fdCreateTime?: number
  /** 创建人 */
  fdCreator?: Partial<IOrgElement>
}
