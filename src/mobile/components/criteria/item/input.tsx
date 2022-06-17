// 文本型筛选器
import React, { useCallback, useContext } from 'react'
import { Input, List } from '@mui/core'
import { IBaseCriterionProps } from './_base'
import CriteriaContext from '../context'

export interface IProps extends IBaseCriterionProps {
  /** 查询提示语 */
  placeholder?: string
}

const baseClass = 'mui-criterion'
const InputCriterion: React.FC<IProps> = props => {
  const { placeholder, name, title } = props
  const context = useContext(CriteriaContext)!

  const handleChange = useCallback((value: string) => {
    value = value.trim()
    context.onChange({ name, value })
  }, [])

  return (
    <div className={`${baseClass} input`}>
      <h4 className={`${baseClass}-title`}>{title}</h4>
      <List>
        <List.Item>
          <Input
            clearable
            placeholder={`${placeholder || ('请输入' + title)}`}
            value={context.values[name]}
            onChange={handleChange} />
        </List.Item>
      </List>
    </div>
  )
}

export default InputCriterion
