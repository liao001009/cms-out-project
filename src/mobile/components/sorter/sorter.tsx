import React, { useEffect, useState, useCallback, useContext } from 'react'
import SorterContext, { ISorterValue } from './context'
import './style.scss'

/** 排序项定义 */
export interface IProps {
  /** 唯一标示，如fdCreateTime */
  key?: string
  /** 排序字段，如fdCreateTime */
  name: string
  /** 排序名，如创建时间 */
  title: string
  /** 默认排序方式 */
  defaultValue?: 'asc' | 'desc'
}

const baseClass = 'mui-sorter'
const Sorter: React.FC<IProps> = props => {
  const { name, title, defaultValue } = props
  const context = useContext(SorterContext)!
  const [value, setValue] = useState<ISorterValue>({ name, value: defaultValue })
  // 初始化
  useEffect(() => {
    context.onInit({ name: name, value: defaultValue })
  }, [])
  // 排序变化
  const handleChange = useCallback(() => {
    // 排序顺序：无->升序->降序->无->……
    const sortArray = ['', 'asc', 'desc']
    const curIndex = sortArray.findIndex((cur) => cur === (value.value || ''))
    const newValue = sortArray[(curIndex + 1) % 3]
    setValue({ name, value: newValue as any })
    context.onChange({ name, value: newValue as any })
  }, [value])
  return (
    <div className={`${baseClass}-item`} onClick={handleChange}>
      <span className={`${baseClass}-label`}>
        {title}
      </span>
      <span className={`${baseClass}-icon ${value.value || ''}`} />
    </div>
  )
}

export default Sorter
