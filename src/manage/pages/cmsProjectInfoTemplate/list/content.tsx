import React, { useCallback, useMemo } from 'react'
import { IContentViewProps } from '@ekp-runtime/render-module'
import Icon from '@lui/icons'
import { Input, Button, Space, Pagination } from '@lui/core'
import Table, { useTable } from '@elem/mk-table'
import api from '@/api/cmsProjectInfoTemplate'
import AddComponent from '@/manage/pages/cmsProjectInfoTemplate/baseEdit'
import { useAdd } from '@/manage/shared/add'
import { $delete } from '@/manage/shared/delete'
import './index.scss'

const Content: React.FC<IContentViewProps> = (props) => {
  const { status, data, queryChange, query, refresh, history } = props
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

  // 表格行操作定义
  const operations = useMemo(
    () => [
      /*编辑*/
      {
        title: <Icon name="edit" type="vector"></Icon>,
        handler: (record, index, event) => handleEdit(event, record)
      },
      /*删除*/
      {
        title: <Icon name="delete" type="vector"></Icon>,
        handler: (record, index, event) => handleDelete(event, record)
      }
    ],
    []
  )

  /** 操作函数集 */

  const { $add: $add, $addClose: $addClose, $addVisible: $addVisible } = useAdd()
  //新建
  const handleAdd = useCallback((event) => {
    event.stopPropagation()
    $add({
      history: history,
      api: api,
      refresh: refresh
    })
  }, [])
  //编辑
  const handleEdit = useCallback((event, record) => {
    event.stopPropagation()
    history.goto(`/cmsProjectInfoTemplate/edit/${record.fdId}`)
  }, [])
  //删除
  const handleDelete = useCallback((event, record) => {
    event.stopPropagation()
    $delete(
      () =>
        api.delete({
          fdId: record.fdId
        }),
      refresh
    )
  }, [])

  // 表格hook
  const { tableProps } = useTable({
    // 数据源
    data: content,
    // 显示序号列
    serial: true,
    // 列定义
    columns,
    // 表格行操作定义
    operations,
    rowSelection: false,
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
      queryChange({ ...query, offset: (pageNo - 1) * pageSize, pageSize })
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
            <React.Fragment>
              <Button type="primary" onClick={handleAdd}>
                新建
              </Button>
              <AddComponent visible={$addVisible} callback={$addClose} mode="add"></AddComponent>
            </React.Fragment>
          </Space>
        </div>
      </div>
      <div className="lui-template-list-table">
        <Table loading={status === 'loading'} {...tableProps} />
      </div>
      {totalSize ? (
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
