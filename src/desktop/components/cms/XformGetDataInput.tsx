import React, { useEffect, useState } from 'react'
import { IContentViewProps } from '@ekp-runtime/render-module'
import { Input } from '@lui/core'
import { EShowStatus } from '@/types/showStatus'

export interface IProps extends IContentViewProps {
  /** 组件状态 */
  showStatus : EShowStatus
  /** apiKey */
  apiKey: any
  /** apiName */
  apiName: string

  onChange: (v) =>void
}

const XformGetDataInput : React.FC<any> = (props) => {
  const { apiKey, apiName, onChange, showStatus, propsParams} = props

  const [listData, setListData] = useState<any>([])

  useEffect(()=>{
    getDataInfo(propsParams?.id)
  },[])

  const getDataInfo = async (id) => {
    try {
      const res = await apiKey[apiName]({ fdId:id })
      onChange?.(res.data.fdId)
      setListData(res.data)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      {/* <Input value={listData.fdName}  disabled />  */}
      {
        showStatus === 'disabled' ?
          <Input value={listData.fdName}  disabled /> :
          showStatus === 'add' || showStatus === 'edit' ?
            <Input value={listData.fdName}  onChange={(value)=>value}  /> :
            <span>{listData.fdName}</span>
      }
    </div>
  )
}
export default XformGetDataInput
