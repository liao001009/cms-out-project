import React, { useImperativeHandle, useCallback, useMemo } from 'react'
import { IContentViewProps } from '@ekp-runtime/render-module'
import Icon from '@lui/icons'
import { Input, Button, Space, Pagination } from '@lui/core'
import Table, { useTable } from '@elem/mk-table'

import './index.scss'

export interface IProps {
  /** ref */
  wrappedComponentRef: any
}

const Content: React.FC<IContentViewProps & IProps> = (props) => {
  const { status, data, queryChange, query, refresh, history } = props
  const { wrappedComponentRef } = props
  const { content, totalSize, pageSize } = data

  // 表格列定义
  const columns = useMemo(
    () => [
      /*名称*/
      {
        title: '名称',
        dataIndex: 'fdName',
        render: (value) => value,
        className: 'mk-table-cell-title'
      },
      /*模板编码*/
      {
        title: '模板编码',
        dataIndex: 'fdCode',
        render: (value) => value
      },
      /*创建人*/
      {
        title: '创建人',
        dataIndex: 'fdCreator',
        render: (value) => value && value.fdName
      },
      /*创建时间*/
      {
        title: '创建时间',
        dataIndex: 'fdCreateTime',
        render: (value) => value && mk.getFormatTime(value, 'YYYY-MM-DD HH:mm')
      }
    ],
    []
  )

  // 表格hook
  const { tableProps, selectedRows } = useTable({
    // 数据源
    data: content,
    // 显示序号列
    serial: true,
    // 列定义
    columns,
    // 支持单选
    rowSelection: { type: 'radio' },
    // 表格搜索，含筛选、排序
    onChange: (newQuery) => {
      queryChange({
        ...query,
        conditions: {
          ...query.conditions,
          ...newQuery.conditions
        },
        sorts: { ...query.sorts, ...newQuery.sorts }
      })
    }
  })

  useImperativeHandle(
    wrappedComponentRef,
    () => ({
      handleOk: (callback) => {
        callback(Array.isArray(selectedRows) ? selectedRows[0] : selectedRows)
      }
    }),
    [selectedRows]
  )

  /** 搜索 */
  const handleSearch = useCallback((keyword: string) => {
    queryChange({
      ...query,
      conditions: {
        ...query.conditions,
        fdName: { $contains: keyword.trim() }
      }
    })
  }, [])

  /** 分页操作 */
  const handlePage = useCallback(
    (pageNo: number, pageSize: number) => {
      queryChange({ ...query, pageNo, pageSize })
    },
    [query]
  )

  return (
    <div className="lui-template-list">
      <div className="lui-template-list-toolbar">
        <div className="lui-template-list-toolbar-left">
          <Input.Search allowClear placeholder="请输入关键词搜索" onSearch={handleSearch} />
        </div>
        <div className="lui-template-list-toolbar-right">
          <Space>
            <Button onClick={refresh}>
              <Icon name="redo" />
            </Button>
          </Space>
        </div>
      </div>
      <div className="lui-template-list-table">
        <Table loading={status === 'loading'} {...tableProps} />
      </div>
      {totalSize > 0 ? (
        <div className="lui-template-list-page">
          <Pagination
            showQuickJumper
            showSizeChanger
            refresh={true}
            total={totalSize}
            pageSize={pageSize}
            onChange={handlePage}
            onRefresh={refresh}
          />
        </div>
      ) : null}
    </div>
  )
}

export default Content
