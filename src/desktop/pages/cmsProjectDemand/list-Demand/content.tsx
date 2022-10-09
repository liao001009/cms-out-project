import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { IContentViewProps } from '@ekp-runtime/render-module'
import Icon from '@lui/icons'
import { Input, Button, Space, Pagination, Tooltip, Message } from '@lui/core'
import Criteria from '@elem/criteria'
import { $reduceCriteria } from '@/desktop/shared/criteria'
import Operation from '@elem/operation'
import Table, { useTable } from '@elem/mk-table'
import api from '@/api/cmsProjectDemand'
import { renderConditions } from '@/desktop/shared/util'
import apiTemplate from '@/api/cmsProjectDemandTemplate'
import { $deleteAll } from '@/desktop/shared/deleteAll'
import './index.scss'

import { Auth } from '@ekp-infra/common'
const baseCls = 'project-demand-list'
const Content: React.FC<IContentViewProps> = (props) => {
  const { status, data, queryChange, query, refresh, history } = props
  const { content = [], totalSize, pageSize } = data
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
      /**主题 */
      {
        title: '主题',
        dataIndex: 'fdSubject',
        render: (value) => value
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
              value: '12',
              label: '撤回'
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
      /*当前处理环节*/
      {
        title: '当前处理环节',
        dataIndex: 'currentNodeNames',
        render (_, row) {
          const value = row?.mechanisms?.lbpmProcess?.lbpm_current_node?.currentNodeNames || '--'
          return <Tooltip title={value}>{value}</Tooltip>
        },
      },
      /*当前处理人*/
      {
        title: '当前处理人',
        dataIndex: 'currentHandlerNames',
        render (_, row) {
          const value = row?.mechanisms?.lbpmProcess?.lbpm_current_processor?.currentHandlerNames || '--'
          return <Tooltip title={value}>{value}</Tooltip>
        },
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
      if (!templateData?.fdId) {
        Message.error('请先配置下流程模板')
      }
      history.goto(`/cmsProjectDemand/add/${templateData.fdId}`)
    },
    [history, selectedRows, refresh, templateData]
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
      let conditions = $reduceCriteria(query, values)
      const newConditions = renderConditions(conditions, values, ['fdProject.fdName', 'fdFrame.fdName', 'fdSubject'])
      conditions = {
        ...conditions,
        ...newConditions
      }
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
      queryChange({ ...query, offset: (pageNo - 1) * pageSize, pageSize })
    },
    [query]
  )

  const onRowClick = useCallback(
    (record) => {
      return {
        onClick: () => {
          if (record.fdProcessStatus < 20) {
            history.goto(`/cmsProjectDemand/edit/${record.fdId}`)
          } else {
            history.goto(`/cmsProjectDemand/view/${record.fdId}`)
          }
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
            <Input.Search allowClear placeholder="请输入主题" onSearch={handleSearch} />
          </div>
          <div className="right">
            {/* 筛选器 */}
            <Criteria key="criteria" onChange={handleCriteriaChange}>
              <Criteria.Input name="fdProject.fdName" title="项目名称" placeholder='请输入项目名称'></Criteria.Input>
              <Criteria.Input name="fdFrame.fdName" title="所属框架" placeholder='请输入框架名称'></Criteria.Input>
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
                <Auth.Auth
                  authURL='/cmsProjectDemand/add'
                  authModuleName='cms-out-manage'
                  unauthorizedPage={null}
                >
                  <Button type="primary" onClick={handleAdd}>
                    新建
                  </Button>
                </Auth.Auth>
                <Auth.Auth
                  authURL='/cmsProjectDemand/deleteAll'
                  authModuleName='cms-out-manage'
                  unauthorizedPage={null}
                >
                  <Button type="default" onClick={handleDeleteAll}>
                    批量删除
                  </Button>
                </Auth.Auth>
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
