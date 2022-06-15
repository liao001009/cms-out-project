// 排序组件
import React from 'react'
import Group, { IProps as IGroupProps } from './group'
import InnerSorter, { IProps } from './sorter'

interface CompoundedComponent extends React.FC<IProps> {
  Group: typeof Group
}

const Sorter = InnerSorter as CompoundedComponent
Sorter.Group = Group
export { IProps, Group, IGroupProps }
export default Sorter