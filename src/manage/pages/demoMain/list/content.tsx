import React, { useCallback, useMemo } from 'react'
import { Locale } from '@ekp-infra/common'
import { IOrgElement } from '@ekp-infra/common/dist/types'
import { IContentViewProps } from '@ekp-runtime/render-module'
import { Input, Button, Modal, Message, Space, Pagination } from '@lui/core'
import Icon from '@lui/icons'
import Layout from '@elem/mk-layout'
import Table, { useTable } from '@elem/mk-table'
import Tree from './tree'
import { IDemoMain } from '@/types/demoMain'
import api from '@/api/demoMain'
import './index.scss'

const { formatMessage } = Locale

const baseClass = 'demo-list'
const Content: React.FC<IContentViewProps> = (props) => {
  const { status, data, queryChange, query, refresh, history } = props
  const { content, totalSize, pageSize } = data

  // 表格列定义
  const columns = useMemo(() => [
    {
      // 名称
      title: formatMessage(':demoMain.fdName', '名称'),
      dataIndex: 'fdName',
      // 标题列规范: 最大、最小宽度做特殊限制
      className: 'mk-table-cell-title'
    },
    {
      // 描述
      title: formatMessage(':demoMain.fdDesc', '描述'),
      dataIndex: 'fdDesc'
    },
    {
      // 创建人
      title: formatMessage(':demoMain.fdCreator', '创建人'),
      dataIndex: 'fdCreator',
      render: (value: IOrgElement) => value && value.fdName
    },
    {
      title: formatMessage(':demoMain.fdCreateTime', '创建时间'),
      dataIndex: 'fdCreateTime',
      render: (value: number) => value && mk.getFormatTime(value, 'YYYY-MM-DD')
    }
  ], [])

  // 表格行操作定义
  const operations = useMemo(() => [
    {
      // 编辑操作
      title: <Icon name='edit' type='vector' />,
      handler: (record: IDemoMain, index, event) => handleModify(event, record)
    },
    {
      // 删除操作
      title: <Icon name='delete' type='vector' />,
      handler: (record: IDemoMain, index, event) => handleDelete(event, record)
    }
  ], [])

  // 表格hook
  const { tableProps } = useTable<IDemoMain>({
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
    },

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

  /** 点击树节点操作 */
  const handleTreeNode = useCallback((id) => {
    queryChange({
      ...query,
      conditions: {
        ...query.conditions,
        fdCategoryId: id
      }
    })
  }, [query])

  /** 分页操作 */
  const handlePage = useCallback((pageNo: number, pageSize: number) => {
    queryChange({ ...query, pageNo, pageSize })
  }, [query])

  /** 新建操作 */
  const handleInit = useCallback(() => {
    history.goto('/demoMain/add')
  }, [])

  /** 编辑操作 */
  const handleModify = useCallback((event, record: IDemoMain) => {
    event.stopPropagation()
    history.goto(`/demoMain/edit/${record.fdId}`)
  }, [])

  /** 查看操作 */
  const handleView = useCallback((event, record: IDemoMain) => {
    event.stopPropagation()
    history.goto(`/demoMain/view/${record.fdId}`)
  }, [])

  /** 删除操作 */
  const handleDelete = useCallback((event, record: IDemoMain) => {
    event.stopPropagation()
    try {
      Modal.confirm({
        title: '当前操作不可恢复，确认删除该分类？',
        className: 'icon-delete',
        icon: <Icon name='exclamation-fill' type='vector' />,
        content: '',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          api.delete({ fdId: record.fdId }).then(() => {
            Message.success('删除成功')
            refresh()
          }).catch(err => {
            const errData = err.response.data
            Message.error(errData.msg)
          })
        }
      })
    } catch (err) {
      console.error(err.response)
    }
  }, [])

  return (
    <Layout>
      <Layout.Sider collapsed={false} theme='light'>
        <Tree onChange={handleTreeNode} />
      </Layout.Sider>
      <Layout>
        <Layout.Content>
          <div className={`${baseClass}`}>
            <div className={`${baseClass}-toolbar`}>
              <div className={`${baseClass}-toolbar-left`}>
                <Input.Search
                  allowClear
                  placeholder='请输入关键词搜索'
                  onSearch={handleSearch} />
              </div>
              <div className={`${baseClass}-toolbar-right`}>
                <Space>
                  <Button onClick={refresh}>
                    <Icon name='redo' />
                  </Button>
                  <Button type='primary' onClick={handleInit}>
                    {formatMessage('demo:operation.add')}
                  </Button>
                </Space>
              </div>
            </div>
            <div className={`${baseClass}-table`}>
              <Table
                loading={status === 'loading'}
                onRow={(data: IDemoMain) => ({
                  onClick: (event) => handleView(event, data)
                })}
                {...tableProps}
              />
            </div>
            <div className={`${baseClass}-page`}>
              <Pagination
                showQuickJumper
                showSizeChanger
                refresh={true}
                total={totalSize}
                pageSize={pageSize}
                onChange={handlePage}
                onRefresh={refresh} />
            </div>
          </div>
        </Layout.Content>
      </Layout>
    </Layout>
  )
}

export default Content