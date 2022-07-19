import React, { useCallback, useMemo } from 'react'

import { DatePicker } from '@lui/core'
import moment from 'moment'


export enum EShowStatus {
  /** 查看 */
  'view' = 'view',
  /** 编辑 */
  'edit' = 'edit',
  /** 添加 */
  'add' = 'add'
}

export const enum EFormatType {
  /** 2020-01-01 */
  'date' = 'yyyy-MM-dd',
  /** 2020-01 */
  'date2' = 'yyyy-MM',
  /** 01-01 */
  'date3' = 'MM-dd',
  /** 2020/01/01 */
  'date4' = 'yyyy/MM/dd',
  /** 2020/01 */
  'date5' = 'yyyy/MM',
  /** 01/01 */
  'date6' = 'MM/dd',
  /** 2020 */
  'date7' = 'yyyy',
  /** 2020-01-01 01:01:01 */
  'datetime' = 'yyyy-MM-dd HH:mm:ss',
  /** 2020-01-01 01:01 */
  'datetime2' = 'yyyy-MM-dd HH:mm',
  /** 2020/01/01 01:01:01 */
  'datetime3' = 'yyyy/MM/dd HH:mm:ss',
  /** 2020/01/01 01:01 */
  'datetime4' = 'yyyy/MM/dd HH:mm'
}

export interface IProps {
  /** function */
  onChange?:(v)=>void
  /** 组件状态 */
  showStatus?:EShowStatus
  /** 组件数据 */
  value?:any
  /** 时间格式 */
  dataPattern?:EFormatType | string
  /** 确定 */
  onOk?:(v)=>void
  /** 提示 */
  placeholder?:string
  testValue?:any
}

const CMSXformRelation : React.FC<IProps> = (props) =>{
  const { onChange,showStatus,value,dataPattern,onOk,placeholder,testValue } = props 
  console.log('value',value)
  console.log('testValue',testValue)

  
  console.log('moment(value)',moment(value))
  

  const changePattern = useMemo(() => {
    // antd和后台时间格式有区别，转换一下
    let changePattern = 'YYYY-MM-DD'
    if (dataPattern === EFormatType.date2) {
      changePattern = 'YYYY-MM'
    } else if (dataPattern === EFormatType.date7) {
      changePattern = 'YYYY'
    } else if (dataPattern === EFormatType.date3) {
      changePattern = 'MM-DD'
    } else if (dataPattern === EFormatType.date4) {
      changePattern = 'YYYY/MM/DD'
    } else if (dataPattern === EFormatType.date5) {
      changePattern = 'YYYY/MM'
    } else if (dataPattern === EFormatType.date6) {
      changePattern = 'MM/DD'
    } else if (dataPattern === EFormatType.datetime) {
      changePattern = 'YYYY-MM-DD HH:mm:ss'
    } else if (dataPattern === EFormatType.datetime2) {
      changePattern = 'YYYY-MM-DD HH:mm'
    } else if (dataPattern === EFormatType.datetime3) {
      changePattern = 'YYYY/MM/DD HH:mm:ss'
    } else if (dataPattern === EFormatType.datetime4) {
      changePattern = 'YYYY/MM/DD HH:mm'
    }
    return changePattern
  }, [dataPattern])

  const clearOtherTime = useCallback((d) => {
    if (!d) return
    const time = d
    switch (changePattern) {
      case 'YYYY-MM-DD':
      case 'YYYY/MM/DD':
      case 'MM-DD':
      case 'MM/DD':
        time.setHours(0)
        time.setMinutes(0)
        time.setSeconds(0)
        time.setMilliseconds(0)
        break
      case 'YYYY-MM':
      case 'YYYY/MM':
        time.setDate(1)
        time.setHours(0)
        time.setMinutes(0)
        time.setSeconds(0)
        time.setMilliseconds(0)
        break
      case 'YYYY':
        time.setMonth(0)
        time.setDate(1)
        time.setHours(0)
        time.setMinutes(0)
        time.setSeconds(0)
        time.setMilliseconds(0)
        break
      case 'YYYY-MM-DD HH:mm:ss':
      case 'YYYY/MM/DD HH:mm:ss':
        time.setMilliseconds(0)
        break
      case 'YYYY-MM-DD HH:mm':
      case 'YYYY/MM/DD HH:mm':
        time.setSeconds(0)
        time.setMilliseconds(0)
        break
    }
    return time
  }, [changePattern])

  const handleChange = useCallback((evt) => {
    const date = clearOtherTime(evt?._d)
    const newValue = evt && date.getTime()
    console.log('newValue',newValue)
    onChange && onChange(newValue)
  }, [])

  const handleOk = useCallback((e) => {
    onOk && onOk(e)
  }, [])

  return (
    <div>
      {
        showStatus === 'edit' || showStatus === 'add' ? (
          <DatePicker 
            format={changePattern}
            onOk={handleOk}
            onChange={handleChange}
            placeholder={placeholder}
            defaultValue={moment(value)}
          />
        ) : (
          <span>{value}</span>
        )
      }
      
    </div>
  )
}

export default CMSXformRelation
