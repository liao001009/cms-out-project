// 地址本筛选器
import React from 'react'
import { IBaseCriterionProps } from './_base'

export interface IProps extends IBaseCriterionProps {
  /** 组织架构类型 */
  orgType?: number
}

const baseClass = 'mui-criterion'
const AddressCriterion: React.FC<IProps> = props => {
  const { title } = props
  return (
    <div className={`${baseClass} address`}>
      <h4 className={`${baseClass}-title`}>{title}</h4>
    </div>
  )
}

export default AddressCriterion



