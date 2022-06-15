// 选项型筛选器
import React from 'react'
import { IBaseCriterionProps } from './_base'

export interface IProps extends IBaseCriterionProps {
  /** 选项集 */
  options: Array<{
    text: string
    value: any
  }>
}

const baseClass = 'mui-criterion'
const OptionsCriterion: React.FC<IProps> = props => {
  const { title } = props
  return (
    <div className={`${baseClass} options`}>
      <h4 className={`${baseClass}-title`}>{title}</h4>
    </div>
  )
}

export default OptionsCriterion
