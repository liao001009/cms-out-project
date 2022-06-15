import React, { useCallback, useMemo } from 'react'
import { IContentViewProps } from '@ekp-runtime/render-module'
import { Search, InfiniteScroll, ToolBarButton, BottomContainer } from '@mui/core'
import List from '@/mobile/components/list'
import ItemRender from '@/mobile/components/item'
import api from '@/api/cmsProjectInfo'
import Sorter from '@/mobile/components/sorter'
import { useAdd } from '@/mobile/shared/add'
import AddComponent from '@/mobile/pages/cmsProjectInfoTemplate/baseList'
import './index.scss'

const Content: React.FC<IContentViewProps> = (props) => {
  const { status, data, queryChange, query, history } = props
  const { content, totalSize, pageSize, offset } = data

  // 字段项定义
  const columns = useMemo(
    () => [
      /*文档标题*/
      {
        title: '文档标题',
        dataIndex: 'fdSubject',
        render: (value) => value,
        type: 'subject'
      }
    ],
    []
  )

  /** 搜索 */
  const handleSearch = useCallback(
    (keyword: string) => {
      queryChange({
        ...query,
        conditions: {
          ...query.conditions,
          fdSubject: { $contains: keyword.trim() }
        }
      })
    },
    [query, queryChange]
  )

  /** 排序 */
  const handleSorter = useCallback(
    (curSorter, allSorter) => {
      queryChange({
        ...query,
        sorts: allSorter.reduce((acc, cur) => {
          acc[cur.name] = cur.value
          return acc
        }, {})
      })
    },
    [query, queryChange]
  )

  /** 筛选 */
  const handleCriteriaChange = useCallback(
    (values) => {
      const newConditions = {
        ...query.conditions,
        ...values
      }
      for (const key in newConditions) {
        if (newConditions[key] === null) {
          newConditions[key] = undefined
        }
      }
      queryChange({
        ...query,
        conditions: newConditions
      })
    },
    [query, queryChange]
  )

  /** 操作函数集 */

  //新建
  const { $add: $add, $addClose: $addClose, $addVisible: $addVisible } = useAdd('/cmsProjectInfo/add/!{selectedRow}')
  const handleAdd = useCallback(
    (event) => {
      event.stopPropagation()
      $add({
        history: history,
        api: api
      })
    },
    [history]
  )

  // 操作
  const toolbarButtons = useMemo(
    () => [
      {
        type: 'button',
        item: '新建',
        buttonColor: 'primary' as 'primary',
        onClick: handleAdd
      }
    ],
    []
  )

  // 进入详情页
  const handleRowClick = useCallback((record) => {
    history.goto(`/cmsProjectInfo/view/${record.fdId}`)
  }, [])

  return (
    <div className="mui-template-list">
      <div className="mui-template-body" style={{ height: window.innerHeight - 75, overflowY: 'scroll' }}>
        <div className="mui-template-list-header">
          {/* 搜索 */}
          <Search placeholder="请输入关键词搜索" onSearch={handleSearch} />
        </div>
        <div className="mui-template-list-toolbar">
          <div className="left">
            {/* 排序 */}
            <Sorter.Group onChange={handleSorter}>
              <Sorter key="fdCreateTime" name="fdCreateTime" title="创建时间" defaultValue="desc"></Sorter>
            </Sorter.Group>
          </div>
          <div className="right">{/* 筛选 */}</div>
        </div>
        <div className={'mui-template-list-list'}>
          {/* 列表 */}
          <List>
            {content.map((item, index: number) => (
              <List.Item key={index}>
                <ItemRender columns={columns} data={item} onRowClick={handleRowClick} />
              </List.Item>
            ))}
          </List>
          <InfiniteScroll
            hasMore={offset + pageSize < totalSize && status === 'done'}
            loadMore={async () => {
              return new Promise((resolve) => {
                queryChange({ ...query, pageNo: (offset + pageSize) / pageSize + 1, pageSize })
                resolve()
              })
            }}
          />
        </div>
      </div>
      {/* 操作 */}
      <div className={'mui-template-list-footer'}>
        <BottomContainer>
          <ToolBarButton data={toolbarButtons} />
          <AddComponent visible={$addVisible} callback={$addClose}></AddComponent>
        </BottomContainer>
      </div>
    </div>
  )
}

export default Content
