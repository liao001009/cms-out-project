// 日期筛选器
import React from 'react'
import { IBaseCriterionProps } from './_base'

export interface IProps extends IBaseCriterionProps {

}

const baseClass = 'mui-criterion'
const CalendarCriterion: React.FC<IProps> = props => {
  const { title } = props
  return (
    <div className={`${baseClass} calendar`}>
      <h4 className={`${baseClass}-title`}>{title}</h4>
    </div>
  )
}

export default CalendarCriterion
