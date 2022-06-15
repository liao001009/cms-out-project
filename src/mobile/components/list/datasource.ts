import { useEffect, useState } from 'react'

export interface IRowProps {
  // 唯一标识
  fdId: string
  // 更多属性
  [key: string]: any
}

export interface IUseDataSourceOptions<T = any> {
  // 最新数据
  data: T[]
  // 数据更新时，判定是否同一数据。若不传diff属性，默认为row1.fdId !== row2.fdId
  diff?: (row1: T, row2: T) => boolean
}

/**
 * 数据源hook
 */
export const useDataSource = <T = any>(options: IUseDataSourceOptions<T>) => {
  const { data = [], diff } = options
  const [allData, setAllData] = useState<T[]>(data)
  useEffect(() => {
    const _diff = diff || ((row1: T, row2: T) => row1['fdId'] !== row2['fdId'])
    setAllData((prevAllData) => {
      // 大数据下性能问题
      const reduceData = [...data]
      return prevAllData.reduce((acc, cur) => {
        let _cur = cur
        for (let i = 0; i < reduceData.length; i++) {
          if (!_diff(reduceData[i], cur)) {
            _cur = reduceData.splice(i, 1)[0]
            break
          }
        }
        acc.push(_cur)
        return acc
      }, [] as T[]).concat(reduceData)
    })
  }, [data])
  
  return {
    data: allData
  }
}
