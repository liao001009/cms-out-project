import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { IContentViewProps } from '@ekp-runtime/render-module'
import Icon from '@lui/icons'
import { Input, Button, Space, Pagination, Message } from '@lui/core'
import Criteria from '@elem/criteria'
import { $reduceCriteria } from '@/desktop/shared/criteria'
import Operation from '@elem/operation'
import Table, { useTable } from '@elem/mk-table'
import api from '@/api/cmsProjectSelectInfo'
import apiTemplate from '@/api/cmsProjectSelectInfoTemplate'
import { $deleteAll } from '@/desktop/shared/deleteAll'
import './index.scss'
import { Auth } from '@ekp-infra/common'

const baseCls = 'project-selectInfo-list'
const Content: React.FC<IContentViewProps> = (props) => {
  const { status, data, queryChange, query, refresh, history } = props
  const { content = [], totalSize, pageSize, offset } = data
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
      /*主题*/
      {
        title: '主题',
        dataIndex: 'fdSubject',
        render: (value) => value
      },
      /*项目名称*/
      {
        title: '项目名称',
        dataIndex: 'fdProject',
        render: (value) => value
      },
      /*中选供应商*/
      {
        title: '中选供应商',
        dataIndex: 'fdSelectedSupplier',
        render: (value) => value
      },
      /*落选供应商*/
      {
        title: '落选供应商',
        dataIndex: 'fdFailSupplier',
        render: (value) => value
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
        Message.error('请先配置模板')
        return
      }
      history.goto(`/cmsProjectSelectInfo/add/${templateData.fdId}`)
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
  const handleSearch = (keyword: string) => {
    queryChange({
      ...query,
      conditions: {
        ...query.conditions,
        fdSubject: { $contains: keyword.trim() }
      }
    })
  }

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
      // 分页
      if (curSorter.type === 'paging') {
        queryChange &&
          queryChange({
            ...query,
            pageNo: curSorter.value || 1
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
          history.goto(`/cmsProjectSelectInfo/view/${record.fdId}`)
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
              <Criteria.Org orgType={8} title="创建人" name="fdCreator.fdId"></Criteria.Org>
              <Criteria.Calendar
                options={Criteria.Calendar.buildOptions()}
                name="fdCreateTime"
                title="创建时间"
              ></Criteria.Calendar>
              <Criteria.Input name="fdSubject" title="主题"></Criteria.Input>
              <Criteria.Input name="fdProject" title="项目名称"></Criteria.Input>
              <Criteria.Input name="fdSelectedSupplier" title="中选供应商"></Criteria.Input>
              <Criteria.Input name="fdFailSupplier" title="落选供应商"></Criteria.Input>
              <Criteria.Criterion
                canMulti={false}
                options={[]}
                name="lbpm_current_processor"
                title=""
              ></Criteria.Criterion>
              <Criteria.Criterion canMulti={false} options={[]} name="lbpm_current_node" title=""></Criteria.Criterion>
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
              {totalSize && (
                <Operation.Paging name="pageNo" value={offset / pageSize} pageSize={pageSize} total={totalSize} />
              )}
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
                  authURL='/cmsProjectSelectInfo/add'
                  authModuleName='cms-out-manage'
                  unauthorizedPage={null}
                >
                  <Button type="primary" onClick={handleAdd}>
                    新建
                  </Button>
                </Auth.Auth>
                <Auth.Auth
                  authURL='/cmsProjectSelectInfo/deleteAll'
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
