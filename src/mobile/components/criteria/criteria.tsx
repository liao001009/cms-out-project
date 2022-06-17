// 筛选器组件
import React, { useState, useCallback } from 'react'
import { Popup, Button } from '@mui/core'
import { CriteriaContextProvider, ICriterionValue } from './context'
import './style.scss'

export interface IProps {
  /** 筛选改变事件 */
  onChange?: (values: { [name: string]: any }) => void
}

const baseClass = 'mui-criteria'
const Criteria: React.FC<IProps> = props => {
  const { onChange, children } = props
  const [visible, setVisible] = useState(false)
  const [values, setValues] = useState<{ [key: string]: any }>({})

  // 筛选项发生变化事件
  const handleChange = useCallback((value: ICriterionValue) => {
    setValues({
      ...values,
      [value.name]: value.value || undefined
    })
  }, [values])

  // 确定事件
  const handleSubmit = useCallback(() => {
    setTimeout(() => setVisible(false), 0)
    onChange && onChange(values)
  }, [values])

  // 重置事件
  const handleReset = useCallback(() => {
    setTimeout(() => setVisible(false), 0)
    setValues({})
    onChange && onChange({})
  }, [])

  return (
    <div className={baseClass}>
      <Popup
        visible={visible}
        position='right'
        onMaskClick={() => setVisible(false)}>
        <CriteriaContextProvider value={{ onChange: handleChange, values }}>
          <div className={`${baseClass}-content`}>
            {children}
          </div>
          <div className={`${baseClass}-footer`}>
            <Button onClick={handleReset}>重置</Button>
            <Button color='primary' onClick={handleSubmit}>确定</Button>
          </div>
        </CriteriaContextProvider>
      </Popup>
    </div>
  )
}

export default Criteria
