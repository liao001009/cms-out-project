import { IContentViewProps } from '@ekp-runtime/module'
import React, { useCallback, useEffect, useState } from 'react'

import { Select } from '@lui/core'

const { Option } = Select

export enum EShowStatus {
  /** 查看 */
  'view' = 'view',
  /** 编辑 */
  'edit' = 'edit',
  /** 添加 */
  'add' = 'add',
  /** 添加 */
  'readOnly' = 'readOnly'
}

export interface IProps extends IContentViewProps {
  /** function */
  onChange?: (v) => void
  /** 组件状态 */
  showStatus?: EShowStatus
  /** 组件数据 */
  value?: any
  /** 请求体 */
  apiRequest: any
  /** 显示下拉框值指定key */
  showFdName: string
}

const CMSXformRelation: React.FC<IProps> = (props) => {
  const { onChange, showStatus, value, apiRequest, showFdName } = props
  const [frameArray, setFrameArray] = useState<any>([])
  console.log('values---', value)

  useEffect(() => {
    if (showStatus === EShowStatus.add || showStatus === EShowStatus.edit || showStatus === EShowStatus.readOnly) {
      init()
    }
  }, [value])

  const init = async () => {
    try {
      const res = await apiRequest
      setFrameArray(res.data.content)
    } catch (error) {
      console.warn('框架类型出错', error)
    }
  }
  const handleChange = useCallback((value) => {
    onChange && onChange(frameArray.find(item => item.fdId === value))
  }, [frameArray])

  return (
    <div>
      {
        showStatus === EShowStatus.edit || showStatus === EShowStatus.add || showStatus === EShowStatus.readOnly ? (
          <Select
            placeholder="请选择"
            onChange={handleChange}
            value={value && value.fdId}
            defaultValue={value && value.fdId}
            style={{ width: '100%' }}
            disabled={showStatus === EShowStatus.readOnly}
          >
            {
              frameArray.map(item => (
                <Option key={item.fdId} value={item.fdId}>{item[showFdName]}</Option>
              ))
            }
          </Select>
        ) : (
          <span>{value && value[showFdName]}</span>
        )
      }

    </div>
  )
}

export default CMSXformRelation
