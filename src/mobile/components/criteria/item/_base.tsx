// 筛选项组件 公共接口

export interface IBaseCriterionProps {
  /** 筛选字段，如fdCreateTime */
  name: string
  /** 筛选名称，如创建时间 */
  title: string
  /** 支持多选 */
  multiple?: boolean
}

