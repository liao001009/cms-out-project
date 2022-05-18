// 左侧树导航
import React, { useCallback } from 'react'
import { Locale } from '@ekp-infra/common'
import CategoryTree from '@elem/mk-tree'
import api from '@/api/demoCategory'

const { formatMessage } = Locale
export interface IProps {
  /** 选中树节点 */
  onChange?: (id: string) => void
}

const baseClass = 'demo-tree'
const Tree: React.FC<IProps> = (props) => {
  const { onChange } = props

  // 点击树节点
  const handleTreeSelect = useCallback((id) => {
    onChange && onChange(id)
  }, [])

  return (
    <CategoryTree
      iconType='fixed'
      className={baseClass}
      getTreeData={api.getTreeData}
      root={[{ value: 'root', text: formatMessage('demo:demoCategory.categoryAll', '全部分类') }]}
      onSelected={handleTreeSelect}
      // getTreeNode={treeNode}
      // nodeActions={nodeActions}
      // rootActions={rootActions}
      showIcon={true}
      saveSearchState
      searchPlaceholder={formatMessage('demo:demoCategory.position', '定位分类')} />
  )
}

export default Tree