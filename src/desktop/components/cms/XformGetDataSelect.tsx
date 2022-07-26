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
  /** 请求体 */
  apiRequest: any
  /** 请求参数 */
  propsParams?: any
  /** 显示下拉框值指定key */
  showFdName: string
  /** 任意类型 */
  [key: string]: any
}

const XformGetDataSelect: React.FC<IProps> = (props) => {
  const {onChange, showStatus, value, apiRequest, propsParams, showFdName } = props
  const [listData, setListData] = useState<any>([])   //接口返回数据
  const [defaultVal, setDefaultVal] = useState<string>('') //默认值
  
  // useEffect(()=>{
  //   //明细表 下拉框改变事件
  //   if(!value && name === 'cmsSupplierPostPriceDe.fdLevel' ) {
  //     $$form?.current.customOnChange((values) => {
  //       const fdFrameId = values[$$tableName].values[rowIndex].fdFrame
  //       if(fdFrameId){
  //         const newParam = { conditions: { 'fdFrame.fdId': { '$eq': fdFrameId } } }
  //         initData(newParam)
  //       }
  //     })
  //     return 
  //   }
  // },[name , rowIndex])

  
  useEffect(() => {
    console.log('props----',props)
    if(showStatus === EShowStatus.add || showStatus === EShowStatus.edit || showStatus === EShowStatus.readOnly ){
      setDefaultVal(value?.fdId)
      initData(propsParams)
    }
  },[])

  const handleChange = useCallback((val) => {
    setDefaultVal(val)
    onChange?.(val)
  }, [listData])

  const initData = async (propsParams) => {
    try {
      const newParams = {...propsParams}
      newParams?.name && delete newParams?.name
      const res = await apiRequest(newParams)
      const newValue = res?.data?.content.map((item) => {
        const newItem = {
          value: item.fdId,
          label: item.fdName
        }
        return newItem
      })

      console.log('newValue----',newValue)
      
      setListData(newValue) //下拉框数组
      if (showStatus === EShowStatus.readOnly) {
        const fdId = res?.data?.content?.[0]?.fdId || ''
        onChange?.(fdId)
        setDefaultVal(fdId)
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
