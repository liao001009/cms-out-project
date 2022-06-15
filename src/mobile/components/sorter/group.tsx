import React, { useState, useCallback } from 'react'
import Sorter, { IProps as ISorter } from './sorter'
import { SorterContextProvider, ISorterValue } from './context'
import './style.scss'

export interface IProps {
  /** 
   * 排序项集合
   *  如果存在options配置优先使用它
   */
  options?: Array<ISorter>
  /** 排序项变化事件 */
  onChange?: (curSorter: ISorterValue, allSorter: Array<ISorterValue>) => void
}

const baseClass = 'mui-sorter'
const SorterGroup: React.FC<IProps> = props => {
  const { options, onChange, children } = props
  const [values, setValues] = useState<Array<ISorterValue>>([])
  // 初始化排序项
  const handleInit = useCallback((value: ISorterValue) => {
    const newValues = [value, ...values]
    setValues(newValues)
  }, [values])
  // 排序项发生变化
  const handleChange = useCallback((value: ISorterValue) => {
    const newValues = [...values]
    const index = newValues.findIndex(curValue => curValue.name === value.name)
    index >= 0 ? (newValues[index] = value) : newValues.push(value)
    setValues(newValues)
    onChange && onChange(value, newValues)
  }, [values])
  return (
    <SorterContextProvider value={{
      onInit: handleInit,
      onChange: handleChange
    }}>
      <div className={`${baseClass}-group`}>
        {
          // 存在options选项，优先使用
          options && options.length > 0 ? options.map(option => {
            return (<Sorter {...option} key={option.key || option.name} />)
          }) : children
        }
      </div>
    </SorterContextProvider>
  )
}
export default SorterGroup