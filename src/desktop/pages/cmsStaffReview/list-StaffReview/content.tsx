import React, { useCallback, useEffect, useState } from 'react'
import { IContentViewProps } from '@ekp-runtime/render-module'
import Icon from '@lui/icons'
import { Button, Space, Pagination, Message } from '@lui/core'
// import Criteria from '@elem/criteria'
// import { $reduceCriteria } from '@/desktop/shared/criteria'
import Table, { useTable } from '@elem/mk-table'
import api from '@/api/cmsStaffReview'
import { $deleteAll } from '@/desktop/shared/deleteAll'
import apiTemplate from '@/api/cmsStaffReviewTemplate'
import './index.scss'
import { staffReviewColumns } from '@/desktop/pages/common/common'
import { Auth } from '@ekp-infra/common'
const baseCls = 'project-review-list'
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
  // const renderFdSupplies = (data) => {
  //   const newData = data.map((i) => {
  //     const str = i.fdName + ','
  //     return str
  //   })
  //   newData[data.length - 1] = newData[data.length - 1].split(',')[0]
  //   return newData
  // }
  // // 表格列定义
  // const columns = useMemo(
  //   () => [
  //     /*主题*/
  //     {
  //       title: '主题',
  //       dataIndex: 'fdSubject',
  //       render: (value) => value
  //     },
  //     /*项目负责人*/
  //     {
  //       title: '项目负责人',
  //       dataIndex: 'fdProjectLeader',
  //       render: (value) => value && value.fdName
  //     },
  //     /*中选供应商*/
  //     {
  //       title: '中选供应商',
  //       dataIndex: 'fdSupplies',
  //       render: (value) => value && renderFdSupplies(value)
  //     },
  //     /**文档状态 */
  //     {
  //       title: '文档状态',
  //       dataIndex: 'fdProcessStatus',
  //       render: (value) => {
  //         const options = [
  //           {
  //             value: '00',
  //             label: '废弃'
  //           },
  //           {
  //             value: '10',
  //             label: '草稿'
  //           },
  //           {
  //             value: '11',
  //             label: '驳回'
  //           },
  //           {
  //             value: '12',
  //             label: '撤回'
  //           },
  //           {
  //             value: '20',
  //             label: '待审'
  //           },
  //           {
  //             value: '21',
  //             label: '挂起'
  //           },
  //           {
  //             value: '29',
  //             label: '异常'
  //           },
  //           {
  //             value: '30',
  //             label: '结束'
  //           }
  //         ]
  //         const option = options.find((option) => option.value === value)

  //         if (!option) {
  //           return value
  //         }

  //         return option.label
  //       }
  //     },
  //     /*当前处理环节*/
  //     {
  //       title: '当前处理环节',
  //       dataIndex: 'currentNodeNames',
  //       render (_, row) {
  //         const value = row?.mechanisms?.lbpmProcess?.lbpm_current_node?.currentNodeNames || '--'
  //         return <Tooltip title={value}>{value}</Tooltip>
  //       },
  //     },
  //     /*当前处理人*/
  //     {
  //       title: '当前处理人',
  //       dataIndex: 'currentHandlerNames',
  //       render (_, row) {
  //         const value = row?.mechanisms?.lbpmProcess?.lbpm_current_processor?.currentHandlerNames || '--'
  //         return <Tooltip title={value}>{value}</Tooltip>
  //       },
  //     }
  //   ],
  //   []
  // )

  // 表格hook
  const { tableProps, selectedRows } = useTable({
    // 数据源
    data: content,
    // 显示序号列
    serial: true,
    // 列定义
    columns: staffReviewColumns,
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

  /** 操作函数集 */

  //新建
  const handleAdd = useCallback(
    (event) => {
      event.stopPropagation()
      if (!templateData?.fdId) {
        Message.error('请先配置模板')
        return
      }
      history.goto((`/cmsStaffReview/add/${templateData.fdId}/1g8d6ik6jw1jwcmurw2n9tcmotgbk5u3ecw0`))
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

  // /** 筛选 */
  // const handleCriteriaChange = useCallback(
  //   (value, values) => {
  //     const conditions = $reduceCriteria(query, values)
  //     queryChange &&
  //       queryChange({
  //         ...query,
  //         conditions
  //       })
  //   },
  //   [query]
  // )

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
            history.goto(`/cmsStaffReview/edit/${record.fdId}`)
          } else {
            history.goto(`/cmsStaffReview/view/${record.fdId}`)
          }
        }
      }
    },
    [history]
  )

  return (
    <React.Fragment>
      <div className={`${baseCls}`}>
        <div className="lui-template-list">
          <div className="lui-template-list-criteria">
            <div className="left">
              {/* 搜索 */}
              {/* <Input.Search allowClear placeholder="请输入关键词搜索" onSearch={handleSearch} /> */}
            </div>
            <div className="right">
              {/* 筛选器 */}
              {/* <Criteria key="criteria" onChange={handleCriteriaChange}>
                <Criteria.Org orgType={8} options={[]} placeholder='请输入姓名'title="创建人" name="fdCreator.fdId"></Criteria.Org>
                <Criteria.Calendar
                  options={Criteria.Calendar.buildOptions()}
                  name="fdCreateTime"
                  title="创建时间"
                ></Criteria.Calendar>
                <Criteria.Calendar
                  options={Criteria.Calendar.buildOptions()}
                  name="fdRealWritTime"
                  title="实际笔试时间"
                ></Criteria.Calendar>
                <Criteria.Calendar
                  options={Criteria.Calendar.buildOptions()}
                  name="fdRealViewTime"
                  title="实际面试时间"
                ></Criteria.Calendar>
                <Criteria.Org orgType={8} options={[]} placeholder='请输入姓名'title="项目负责人" name="fdProjectLeader.fdId"></Criteria.Org>
                <Criteria.Input name="fdSupplies" title="中选供应商"></Criteria.Input>
                <Criteria.Criterion
                  canMulti={false}
                  options={[]}
                  name="lbpm_current_processor"
                  title=""
                ></Criteria.Criterion>
                <Criteria.Criterion canMulti={false} options={[]} name="lbpm_current_node" title=""></Criteria.Criterion>
              </Criteria> */}
            </div>
          </div>
          <div className="lui-template-list-toolbar">
            {/* 排序 */}
            <div className="left">
              {/* <Operation key="operation" onChange={handleSorter}>
                <Operation.SortGroup>
                  <Operation.Sort key="fdCreateTime" name="fdCreateTime" title="创建时间"></Operation.Sort>
                </Operation.SortGroup>
                {totalSize && (
                  <Operation.Paging name="pageNo" value={offset / pageSize} pageSize={pageSize} total={totalSize} />
                )}
              </Operation> */}
            </div>
            <div className="right">
              <Space>
                <Button onClick={refresh}>
                  <Icon name="redo" />
                </Button>
                {/* 操作栏 */}
                <React.Fragment>
                  <Auth.Auth
                    authURL='/cmsStaffReview/add'
                    authModuleName='cms-out-manage'
                    unauthorizedPage={null}
                  >
                    <Button type="primary" onClick={handleAdd}>
                      新建
                    </Button>
                  </Auth.Auth>
                  <Auth.Auth
                    authURL='/cmsStaffReview/deleteAll'
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
    </React.Fragment>
  )
}

export default Content
