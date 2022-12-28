import React, { useCallback, useMemo, useState, useEffect } from 'react'
import { IContentViewProps } from '@ekp-runtime/render-module'
import Icon from '@lui/icons'
import { Input, Button, Space, Pagination } from '@lui/core'
import Criteria from '@elem/criteria'
import { $reduceCriteria } from '@/desktop/shared/criteria'
import Operation from '@elem/operation'
import Table, { useTable } from '@elem/mk-table'
import api from '@/api/cmsProjectInfo'
import { useAdd } from '@/desktop/shared/add'
import { $deleteAll } from '@/desktop/shared/deleteAll'
import ListImport from '@/desktop/components/listImport'
import './index.scss'
import { Auth } from '@ekp-infra/common'
import { roleAuthCheck } from '@/desktop/shared/util'
const bacls = 'projectInfo-list'
const Content: React.FC<IContentViewProps> = (props) => {
  const { status, data, queryChange, query, refresh, history } = props
  const { content = [], totalSize, pageSize } = data
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  // 是否有导入权限
  const [importRole, setImportRole] = useState<boolean>(false)
  useEffect(() => {
    getRole()
  }, [])
  const getRole = async () => {
    const role = await roleAuthCheck([{
      status: 'checking',
      key: 'auth0',
      role: 'ROLE_CMSOUTPROJECTINFO_IMPORT'
    },])
    setImportRole(role)
  }
  // 表格列定义
  const columns = useMemo(
    () => [
      /*项目名称*/
      {
        title: '项目名称',
        dataIndex: 'fdName',
        render: (value) => value
      },
      /*项目编号*/
      {
        title: '项目编号',
        dataIndex: 'fdCode',
        render: (value) => value
      },
      /*项目所属框架*/
      {
        title: '项目所属框架',
        dataIndex: 'fdFrame',
        render: (value) => value && value.fdName
      },
      /*项目性质*/
      {
        title: '项目性质',
        dataIndex: 'fdProjectNature',
        render: (value) => {
          const options = [
            {
              value: '1',
              label: '项目外包'
            },
            {
              value: '2',
              label: '厂商驻场实施'
            }
          ]
          const option = options.find((option) => option.value === value)

          if (!option) {
            return value
          }

          return option.label
        }
      },
      /*所属部门*/
      {
        title: '所属部门',
        dataIndex: 'fdBelongDept',
        render: (value) => value && value.fdName
      },
      /*所属组/团队*/
      {
        title: '所属组/团队',
        dataIndex: 'fdBelongTeam',
        render: (value) => value && value.fdName
      },
      /*项目负责人*/
      {
        title: '项目负责人',
        dataIndex: 'fdProjectPrincipal',
        render: (value) => value && value.fdName
      },
      /*项目立项时间*/
      {
        title: '项目立项时间',
        dataIndex: 'fdProjectDate',
        render: (value) => value && mk.getFormatTime(value, 'YYYY-MM-DD')
      },
      /*预计开始时间*/
      {
        title: '预计开始时间',
        dataIndex: 'fdStartDate',
        render: (value) => value && mk.getFormatTime(value, 'YYYY-MM-DD')
      },
      /*预计结束日期*/
      {
        title: '预计结束日期',
        dataIndex: 'fdEndDate',
        render: (value) => value && mk.getFormatTime(value, 'YYYY-MM-DD')
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

  /** 操作函数集 */

  //新建
  const { $add: $add } = useAdd('/cmsProjectInfo/add')
  const handleAdd = useCallback(
    (event) => {
      event.stopPropagation()
      $add({
        history: history,
        api: api,
        selectedRows: selectedRows,
        refresh: refresh
      })
    },
    [history, selectedRows, refresh]
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
  //导入
  const handleImportData = useCallback(
    (event) => {
      event.stopPropagation()
      setModalVisible(true)
    },
    [history, selectedRows, refresh]
  )

  /** 搜索 */
  const handleSearch = (keyword: string) => {
    queryChange({
      ...query,
      offset: 0,
      conditions: {
        ...query.conditions,
        fdName: { $contains: keyword.trim() }
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
          offset: 0,
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
          history.goto(`/cmsProjectInfo/view/${record.fdId}`)
        }
      }
    },
    [history]
  )

  return (

    <React.Fragment>
      <div className={bacls}>
        <div className="lui-template-list">
          <div className="lui-template-list-criteria">
            <div className="left">
              {/* 搜索 */}
              <Input.Search allowClear placeholder="请输入项目名称" onSearch={handleSearch} />
            </div>
            <div className="right">
              {/* 筛选器 */}
              <Criteria key="criteria" onChange={handleCriteriaChange}>
                <Criteria.Input name="fdCode" title="项目编号" placeholder='请输入项目编号'></Criteria.Input>
                <Criteria.Input name="fdFrame.fdName" title="项目所属框架" placeholder='请输入项目所属框架'></Criteria.Input>
                <Criteria.Criterion
                  canMulti={false}
                  options={[
                    {
                      text: '不限',
                      value: ''
                    },
                    {
                      text: '项目外包',
                      value: '1'
                    },
                    {
                      text: '厂商驻场实施 ',
                      value: '2'
                    }
                  ]}
                  name="fdProjectNature"
                  title="项目性质"
                ></Criteria.Criterion>
                <Criteria.Org orgType={2} title="所属部门" name="fdBelongDept.fdId"></Criteria.Org>
                <Criteria.Org orgType={2} title="所属组/团队" name="fdBelongTeam.fdId"></Criteria.Org>
                <Criteria.Org orgType={8} options={[]} placeholder='请输入姓名' title="项目负责人" name="fdProjectPrincipal.fdId"></Criteria.Org>
                <Criteria.Calendar
                  options={Criteria.Calendar.buildOptions()}
                  name="fdProjectDate"
                  title="项目立项时间"
                ></Criteria.Calendar>
                <Criteria.Calendar
                  options={Criteria.Calendar.buildOptions()}
                  name="fdStartDate"
                  title="预计开始时间"
                ></Criteria.Calendar>
                <Criteria.Calendar
                  options={Criteria.Calendar.buildOptions()}
                  name="fdEndDate"
                  title="预计结束日期"
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
                    authURL='/cmsProjectInfo/add'
                    authModuleName='cms-out-manage'
                    unauthorizedPage={null}
                  >
                    <Button type="primary" onClick={handleAdd}>
                      新建
                    </Button>
                  </Auth.Auth>
                  <Auth.Auth
                    authURL='/cmsProjectInfo/deleteAll'
                    authModuleName='cms-out-manage'
                    unauthorizedPage={null}
                  >
                    <Button type="default" onClick={handleDeleteAll}>
                      批量删除
                    </Button>
                  </Auth.Auth>
                  <Button type="default" onClick={handleImportData}>
                    导入
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
      {
        importRole ? <ListImport
          fdEntityName='com.landray.cms.out.manage.core.entity.project.CmsProjectInfo'
          visible={modalVisible}
          onCancle={() => setModalVisible(false)}
        /> : null
      }

    </React.Fragment>
  )
}

export default Content
