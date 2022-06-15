// 布尔型筛选器
import React from 'react'
import { IBaseCriterionProps } from './_base'

export interface IProps extends IBaseCriterionProps {
  /** 布尔选项 */
  options: Array<{
    key: string
    value: string | boolean
  }>
}

const baseClass = 'mui-criterion'
const BooleanCriterion: React.FC<IProps> = props => {
  const { title } = props
  return (
    <div className={`${baseClass} boolean`}>
      <h4 className={`${baseClass}-title`}>{title}</h4>
    </div>
  )
}

export default BooleanCriterion
