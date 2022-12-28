import React, { useCallback, useEffect, useState } from 'react'
import { IContentViewProps } from '@ekp-runtime/render-module'
import { EShowStatus } from '@/utils/status'
// import XformSelect from '@/desktop/components/form/XformSelect'
import { Select } from '@lui/core'
const { Option } = Select

export interface IProps extends IContentViewProps {
  /** function */
  onChange?: (v) => void
  /** 组件状态 */
  showStatus?: EShowStatus
  /** 组件数据 */
  value?: any
  /** 初始化数据 */
  initData?: any
  /** 请求体 */
  apiRequest?: any
  /** 请求参数 */
  conditions?: any
  /** 显示下拉框值指定key */
  showFdName?: string
  /** 是否必填 */
  isRequired?: boolean
  /**是否是评级 */
  isStaffReview?: boolean
  /** 任意类型 */
  [key: string]: any
}

const XformGetDataSelect: React.FC<IProps> = (props) => {
  const { onChange, showStatus, value, initData, apiRequest, conditions = {}, showFdName = '', rowIndex, isStaffReview = false, detailData } = props
  const [listData, setListData] = useState<any>([])   //接口返回数据

  useEffect(() => {
    if (showStatus === EShowStatus.add || showStatus === EShowStatus.edit || showStatus === EShowStatus.readOnly) {
      initDataList(conditions)
    }
  }, [])

  useEffect(() => {
    if (initData && Object.keys(initData).length) {
      setListData(initData[rowIndex] || []) //下拉框数组
    }
  }, [JSON.stringify(value), JSON.stringify(initData)])

  const handleChange = useCallback((val) => {
    onChange?.(listData.find(item => item.fdId === val))
  }, [listData])

  const initDataList = async (conditions) => {
    try {
      const res = await apiRequest(conditions)
      setListData(res?.data?.content || []) //下拉框数组
    } catch (error) {
      console.error(error)
      setListData([]) //下拉框数组
    }
  }
  console.log('listData555', listData)
  console.log('value555', value)
  console.log('detailData555', detailData)
  return (
    <div>
      {
        isStaffReview && detailData.cmsStaffReviewDetail[rowIndex].fdConclusion !== '1' ? <span></span> :
          showStatus === EShowStatus.add || showStatus === EShowStatus.edit || showStatus === EShowStatus.readOnly ?
            <Select
              onChange={(v) => handleChange(v)}
              value={typeof value === 'object' ? value.fdId : value}
              defaultValue={typeof value === 'object' ? value.fdId : value}
              style={{ width: '100%' }}
              disabled={showStatus === EShowStatus.readOnly}
            >
              {
                listData.map(item => (
                  <Option key={item.fdId} value={item.fdId}>{item[showFdName]}</Option>
                ))
              }
            </Select>
            :
            <span>{value && value[showFdName]}</span>
      }
    </div>
  )
}
export default XformGetDataSelect
