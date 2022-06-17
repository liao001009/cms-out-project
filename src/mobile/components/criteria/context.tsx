import React from 'react'

export interface ICriterionValue {
  /** 筛选字段，如fdCreateTime */
  name: string
  /** 筛选值 */
  value?: any
}

export interface ICriteriaContextProps {
  /** 筛选改变事件 */
  onChange: (value: ICriterionValue) => void
  /** 所有筛选值 */
  values: { [key: string]: any }
}

const CriteriaContext = React.createContext<ICriteriaContextProps | null>(null)

export const CriteriaContextProvider = CriteriaContext.Provider
export default CriteriaContext
