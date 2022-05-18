import { IBaseType, IOrgElement } from '@ekp-infra/common/dist/types'
/**
 * 简单分类定义
 */
export interface IDemoCategroy extends IBaseType {
  /** 名称 */
  fdId: string
  /** 值 */
  fdName?: string
  /** 层级id */
  fdHierarchyId?: string
  /** 创建时间 */
  fdCreateTime?: number
  /** 创建人 */
  fdCreator?: Partial<IOrgElement>
}
