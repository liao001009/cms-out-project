import React, { useCallback, useEffect, useState } from 'react'
import { IContentViewProps } from '@ekp-runtime/render-module'
import { EShowStatus } from '@/types/showStatus'
import XformSelect from '@/desktop/components/form/XformSelect'
import { fmtMsg } from '@ekp-infra/respect'

export interface IProps extends IContentViewProps {
  /** function */
  onChange?: (v) => void
  /** 组件状态 */
  showStatus?: EShowStatus
  /** 组件数据 */
  value?: any
  /** apiKey */
  apiKey: any
  /** apiName */
  apiName: string
  /** 请求参数 */
  propsParams: { id: string }
  /** 显示下拉框值指定key */
  showFdName: string
}

const XformGetDataSelect: React.FC<IProps> = (props) => {
  const { onChange, showStatus, value, apiKey, apiName, propsParams, showFdName } = props
  const [listData, setListData] = useState<any>([])   //接口返回数据
  const [defaultVal, setDefaultVal] = useState<string>('') //默认值


  useEffect(() => {
    setDefaultVal(value?.fdId)
    if (showStatus === EShowStatus.add || showStatus === EShowStatus.edit || showStatus === EShowStatus.readOnly) {
      initData(propsParams)
    }
  }, [])

  const handleChange = useCallback((val) => {
    setDefaultVal(val)
    onChange?.(val)
  }, [listData])

  const initData = async (propsParams) => {
    try {
      const res = await apiKey[apiName](propsParams)
      const newValue = res?.data?.content.map((item) => {
        const newItem = {
          value: item.fdId,
          label: item.fdName
        }
        return newItem
      })

      setListData(newValue) //下拉框数组
      //只读情况下给下拉框默认值
      if (showStatus === EShowStatus.readOnly) {
        onChange?.(res?.data?.content?.[0]?.fdId || '')
        setDefaultVal(res?.data?.content?.[0]?.fdId || '')
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (

    <div>
      {
        showStatus === EShowStatus.add || showStatus === EShowStatus.edit || showStatus === EShowStatus.readOnly ?
          <XformSelect
            showStatus={showStatus}
            placeholder={fmtMsg(':cmsContractInfo.form.!{l3gwgyfousrbns41tdb}', '请输入')}
            options={listData}
            value={defaultVal}
            onChange={handleChange}
            required={true}
          /> :
          <span>{value && value[showFdName]}</span>
      }

    </div>
  )
}
export default XformGetDataSelect
