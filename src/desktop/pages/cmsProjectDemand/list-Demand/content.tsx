import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { IContentViewProps } from '@ekp-runtime/render-module'
import Icon from '@lui/icons'
import { Input, Button, Space, Pagination } from '@lui/core'
import Criteria from '@elem/criteria'
import { $reduceCriteria } from '@/desktop/shared/criteria'
import Operation from '@elem/operation'
import Table, { useTable } from '@elem/mk-table'
import api from '@/api/cmsProjectDemand'
import apiTemplate from '@/api/cmsProjectDemandTemplate'
import { $deleteAll } from '@/desktop/shared/deleteAll'
import './index.scss'


const baseCls = 'project-demand-list'
const Content: React.FC<IContentViewProps> = (props) => {
  const { status, data, queryChange, query, refresh, history } = props
  const { content, totalSize, pageSize } = data
  const [templateData, setTemplateData] = useState<any>({})
  useEffect(() => {
    loadTemplateData()
  }, [])

  const loadTemplateData = async () => {
    try {
      const res = await apiTemplate.list({
        sorts: { fdCreateTime: 'desc' },
        columns: ['fdId', 'fdName', 'fdCode', 'fdCreator', 'fdCreateTime'],
        ...query
      })
      setTemplateData(res?.data?.content[0])
    } catch (error) {
      console.error(error)
    }
  }
  // 表格列定义
  const columns = useMemo(
    () => [
      /*项目名称*/
      {
        title: '项目名称',
        dataIndex: 'fdProject',
        render: (value) => value && value.fdName
      },
      /*所属框架*/
      {
        title: '所属框架',
        dataIndex: 'fdFrame',
        render: (value) => value && value.fdName
      },
      /*创建时间*/
      {
        title: '创建时间',
        dataIndex: 'fdCreateTime',
        render: (value) => value && mk.getFormatTime(value, 'YYYY-MM-DD HH:mm')
      },
      /*文档状态*/
      {
        title: '文档状态',
        dataIndex: 'fdProcessStatus',
        render: (value) => {
          const options = [
            {
              value: '00',
              label: '废弃'
            },
            {
              value: '10',
              label: '草稿'
            },
            {
              value: '11',
              label: '驳回'
            },
            {
              value: '20',
              label: '待审'
            },
            {
              value: '21',
              label: '挂起'
            },
            {
              value: '29',
              label: '异常'
            },
            {
              value: '30',
              label: '结束'
            }
          ]
          const option = options.find((option) => option.value === value)

          if (!option) {
            return value
          }

          return option.label
        }
      },
      /*undefined*/
      {
        title: '',
        dataIndex: 'lbpm_current_processor',
        render: (value) => value
      },
      /*undefined*/
      {
        title: '',
        dataIndex: 'lbpm_current_node',
        render: (value) => value
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
    // 支持行选择
    rowSelection: true,
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


  // 新建
  const handleAdd = useCallback(
    (event) => {
      event.stopPropagation()
      history.goto(`/cmsProjectDemand/add/${templateData.fdId}`)
    },
    [history, selectedRows, refresh,templateData]
  )
  //批量删除
  const handleDeleteAll = useCallback(
    (event) => {
      event.stopPropagation()
      $deleteAll({
        api: api,
        selectedRows: selectedRows,
        refresh: refresh
      })
    },
    [history, selectedRows, refresh]
  )

  /** 搜索 */
  const handleSearch = useCallback((keyword: string) => {
    queryChange({
      ...query,
      conditions: {
        ...query.conditions,
        fdSubject: { $contains: keyword.trim() }
      }
    })
  }, [])

  /** 筛选 */
  const handleCriteriaChange = useCallback(
    (value, values) => {
      const conditions = $reduceCriteria(query, values)
      queryChange &&
        queryChange({
          ...query,
          conditions
        })
    },
    [query]
  )

  /** 排序 */
  const handleSorter = useCallback(
    (curSorter, allSorter) => {
      // 排序
      if (curSorter.type === 'sort') {
        queryChange &&
          queryChange({
            ...query,
            // 排序
            sorts: allSorter
              .filter((sorter) => sorter.type === 'sort' && sorter.value)
              .reduce((acc, cur) => {
                acc[cur.name] = cur.value
                return acc
              }, {})
          })
      }
    },
    [query, queryChange]
  )

  /** 分页操作 */
  const handlePage = useCallback(
    (pageNo: number, pageSize: number) => {
      queryChange({ ...query, pageNo, pageSize })
    },
    [query]
  )

  const onRowClick = useCallback(
    (record) => {
      return {
        onClick: () => {
          history.goto(`/cmsProjectDemand/view/${record.fdId}`)
        }
      }
    },
    [history]
  )

  return (
    <div className={baseCls}>
      <div className="lui-template-list">
        <div className="lui-template-list-criteria">
          <div className="left">
            {/* 搜索 */}
            <Input.Search allowClear placeholder="请输入关键词搜索" onSearch={handleSearch} />
          </div>
          <div className="right">
            {/* 筛选器 */}
            <Criteria key="criteria" onChange={handleCriteriaChange}>
              <Criteria.Input name="fdProject" title="项目名称"></Criteria.Input>
              <Criteria.Input name="fdFrame" title="所属框架"></Criteria.Input>
              <Criteria.Calendar
                options={Criteria.Calendar.buildOptions()}
                name="fdCreateTime"
                title="创建时间"
              ></Criteria.Calendar>
            </Criteria>
          </div>
        </div>
        <div className="lui-template-list-toolbar">
          <div className="left">
            <Operation key="operation" onChange={handleSorter}>
              {/* 排序 */}
              <Operation.SortGroup>
                <Operation.Sort key="fdCreateTime" name="fdCreateTime" title="创建时间"></Operation.Sort>
              </Operation.SortGroup>
            </Operation>
          </div>
          <div className="right">
            <Space>
              <Button onClick={refresh}>
                <Icon name="redo" />
              </Button>
              {/* 操作栏 */}
              <React.Fragment>
                <Button type="primary" onClick={handleAdd}>
                  新建
                </Button>
                <Button type="default" onClick={handleDeleteAll}>
                  批量删除
                </Button>
              </React.Fragment>
            </Space>
          </div>
        </div>
        <div className="lui-template-list-table">
          <Table loading={status === 'loading'} {...tableProps} onRow={onRowClick} />
        </div>
        <div className="lui-template-list-page">
          {totalSize ? (
            <Pagination
              showQuickJumper
              showSizeChanger
              refresh={true}
              total={totalSize}
              pageSize={pageSize}
              onChange={handlePage}
              onRefresh={refresh}
            />
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default Content
