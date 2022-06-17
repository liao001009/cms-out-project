import React from 'react'

export interface ISorterValue {
  /** 排序字段，如fdCreateTime */
  name: string
  /** 默认排序方式 */
  value?: 'asc' | 'desc'
}

export interface ISorterContextContextProps {
  /** 初始化排序项 */
  onInit: (value: ISorterValue) => void
  /** 排序改变事件 */
  onChange: (value: ISorterValue) => void
}

const SorterContext = React.createContext<ISorterContextContextProps | null>(null)

export const SorterContextProvider = SorterContext.Provider
export default SorterContext
