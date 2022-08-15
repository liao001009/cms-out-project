import { IContentViewProps } from '@ekp-runtime/module'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Input, Message, Modal, Pagination } from '@lui/core'
import Tag from '@antd/tag'
import Table, { useTable } from '@elem/mk-table'
import Criteria from '@elem/criteria'
import { $reduceCriteria } from '@/desktop/shared/criteria'
import './index.scss'
import { criertiaObj } from '@/desktop/pages/common/common'

export enum EShowStatus {
  /** 查看 */
  'view' = 'view',
  /** 编辑 */
  'edit' = 'edit',
  /** 添加 */
  'add' = 'add',
  /** 只读 */
  'readOnly' = 'readOnly'
}

export interface IProps extends IContentViewProps {
  /** 回调调整明细表事件 */
  onChangeProps?: (v, r) => void
  /** function */
  onChange?: (v) => void
  /** 组件状态 */
  showStatus?: EShowStatus
  /** 组件数据 */
  value?: any
  /** 请求体 */
  apiRequest?: any
  /** 表格表头 */
  columnsProps?: Array<any>
  /** 选中名称 */
  chooseFdName?: string
  /** 弹窗标题 */
  modalTitle?: string
  /** 渲染筛选 */
  criteriaKey?: any
  /** apiKey */
  apiKey: any
  /** apiName */
  apiName: string
  /** 要改变的筛选项,将$eq改成$contains */
  criteriaProps?: any
  /** 行号 */
  rowIndex?: number
  /** 默认的表格列筛选 */
  defaultTableCriteria?: any
  /** 渲染底部 */
  showFooter?: boolean
  /** 多选 */
  multiple?: boolean
  /** 是否展示筛选 */
  showCriteria?: boolean
  /**接口参数(不在conditions里面的) */
  params?: any
  /** 默认为空数据 */
  defaultDataNull?: boolean
  /** 扩展 */
  [key: string]: any
}

const XformModal: React.FC<IProps> = (props) => {

  const {
    onChange,
    showStatus,
    value,
    criteriaKey,
    query = {},
    queryChange,
    history,
    chooseFdName = '',
    columnsProps = [],
    modalTitle = '标题',
    apiKey,
    apiName,
    onChangeProps,
    criteriaProps = [],
    rowIndex = 0,
    defaultTableCriteria = {},
    showFooter = false,
    multiple = false,
    showCriteria = true,
    otherData = {},
    showOther = false,
    params = {},
    defaultDataNull = false
  } = props

  const [listData, setListData] = useState<any>([])
  const [visible, setVisible] = useState<boolean>(false)
  const [fdName, setFdName] = useState<string>(value && value.fdName || '')
  // 多选时，选中的数据
  const [selectedRowsData, setSelectedRows] = useState<any>([])
  // 表单传过来的初始值，为了点击取消时，还原数据
  const [initSelectedArr, setInitSelectArr] = useState<any>(value)
  // 用来判断是按了确认按钮还是取消按钮
  const [flag, setFlag] = useState<boolean>(false)

  /** 组装表格列头筛选项 */
  const getDefaultTableColumns = () => {
    if (Object.keys(defaultTableCriteria).length <= 0) return {}
    const newConditions = {}
    Object.keys(defaultTableCriteria).forEach(key => {
      const newConditionsKey = {}
      newConditionsKey[defaultTableCriteria[key]['searchKey']] = defaultTableCriteria[key]['searchValue']
      newConditions[key] = defaultTableCriteria[key]['searchValue'] && newConditionsKey
    })
    if (params && Object.keys(params).length) {
      return {
        conditions: { ...newConditions },
        ...params
      }
    }
    return {
      conditions: { ...newConditions }
    }
  }
  /** 为了兼容特殊筛选组装表格列头筛选项如外包人员评审调级，调级结果弹窗筛选 */
  const getOtherDefaultTableColumns = () => {
    const postData = props.$$form.current.getFieldsValue()[props.$$tableName].values.length && props.$$form.current.getFieldsValue()[props.$$tableName].values[rowIndex]
    if (!postData.fdPost) return {}
    const postFilter = otherData.length && otherData?.find(item => item.value === postData.fdPost.fdId)
    if (Object.keys(defaultTableCriteria).length <= 0) return {}
    const newConditions = {}
    Object.keys(defaultTableCriteria).forEach(key => {
      const newConditionsKey = {}
      newConditionsKey[defaultTableCriteria[key]['searchKey']] = postFilter.fdFrame.fdName || ''
      newConditions[key] = postFilter.fdFrame.fdName && newConditionsKey
    })
    return {
      conditions: { ...newConditions }
    }
  }

  useEffect(() => {
    if (showStatus === EShowStatus.add || showStatus === EShowStatus.edit) {
      if (showOther) return
      getListData({
        ...getDefaultTableColumns()
      })
    }
  }, [JSON.stringify(defaultTableCriteria), JSON.stringify(otherData), showOther])

  useEffect(() => {
    if (showStatus === EShowStatus.add || showStatus === EShowStatus.edit) {
      if (showOther && visible) {
        const postData = props.$$form.current.getFieldsValue()[props.$$tableName].values.length && props.$$form.current.getFieldsValue()[props.$$tableName].values[rowIndex]
        if (!postData.fdPost) {
          Message.warning('请选择姓名')
          return
        }
        getListData({
          ...getOtherDefaultTableColumns()
        })
      }
    }
  }, [JSON.stringify(defaultTableCriteria), JSON.stringify(otherData), showOther, visible])
  const getListData = async (data, ...args) => {
    try {
      const res = await apiKey[apiName](data)
      setListData(defaultDataNull ? args.length ? res.data : {} : res.data)
    } catch (error) {
      Message.error(error)
    }
  }
  // 表格列定义
  const columns = useMemo(() => columnsProps, [])

  // 表格hook
  const { tableProps, selectedRows } = useTable({
    // 数据源
    data: listData?.content || [],
    // 列定义
    columns,
    // 显示序号列
    serial: true,
    // 支持行选择
    rowSelection: multiple ? {
      selectedRowKeys: selectedRowsData,
      multiple
    } : false,
  })
  useEffect(() => {
    setSelectedRows([...selectedRows])
  }, [selectedRows])
  useEffect(() => {
    multiple && setSelectedRows(value && value.map(i => i.fdId) || [])
  }, [])
  // 分页操作 
  const handlePage = useCallback(
    (pageNo: number, pageSize: number) => {
      queryChange({ ...query, offset: (pageNo - 1) * pageSize, pageSize })
    },
    [query]
  )
  // 行点击
  const onRowClick = useCallback(
    (record) => {
      return !multiple ? {
        onClick: () => {
          onChange && onChange(record)
          setVisible(false)
          setFdName(record[chooseFdName])
          // @ts-ignore
          onChangeProps && onChangeProps(record, rowIndex)
        }
      } : {}
    },
    [history]
  )
  /** 筛选 */
  const handleCriteriaChange = useCallback(
    (value, values) => {
      const conditions = $reduceCriteria(query, values)
      const newConditions = {}
      criteriaProps.length && criteriaProps.map(item => {
        newConditions[item] = conditions[item] ? {
          $contains: conditions[item]['$eq']
        } : undefined
      })
      if (Object.keys(defaultTableCriteria).length) {

        const defaultConditions = {}
        Object.keys(defaultTableCriteria).forEach(key => {
          const defaultConditionsKey = {}
          defaultConditionsKey[defaultTableCriteria[key]['searchKey']] = defaultTableCriteria[key]['searchValue']
          defaultConditions[key] = defaultTableCriteria[key]['searchValue'] && defaultConditionsKey
        })
        getListData({
          ...query,
          conditions: { ...conditions, ...newConditions, ...defaultConditions }
        }, true)
      } else {
        getListData({
          ...query,
          conditions: { ...conditions, ...newConditions }
        }, true)
      }

    },
    [query]
  )
  // 确定按钮
  const handleOk = useCallback(() => {
    setVisible(false)
    setFlag(true)
    const newData = listData?.content.length && listData?.content.filter(item => selectedRowsData.includes(item.fdId))
    setInitSelectArr(newData)
    onChange && onChange(newData)
  }, [listData, selectedRowsData])

  const renderTag = () => {
    if (flag) {
      if (selectedRowsData && selectedRowsData.length) {
        const newData = listData?.content.length && listData?.content.filter(item => selectedRowsData.includes(item.fdId))
        return newData.map(i => {
          return <Tag key={i.fdId}>{i.fdName}</Tag>
        })
      } else {
        return <span style={{ color: '#c3c3c3' }}>请选择</span>
      }
    } else {
      if (initSelectedArr && initSelectedArr.length) {
        return initSelectedArr.map(i => {
          return <Tag key={i.fdId}>{i.fdName}</Tag>
        })
      } else {
        return <span style={{ color: '#c3c3c3' }}>请选择</span>
      }
    }
  }
  const handleCancel = () => {
    setFlag(false)
    setVisible(false)
    if (multiple) {
      setSelectedRows(initSelectedArr.map(i => i.fdId))
      onChange && onChange(initSelectedArr)
    }
  }

  const readOnlyStyle = {
    'background': '#f5f5f5',
    'color': 'rgba(0,0,0,.25)',
    'cursor': 'not-allowed',
    'pointerEvents': 'none'
  } as any
  return (
    <React.Fragment>
      <div>
        {
          showStatus === 'edit' || showStatus === 'add' || showStatus === 'readOnly' ? multiple ? (
            <div className='multiple-input' style={showStatus === 'readOnly' ? readOnlyStyle : {}} onClick={() => setVisible(true)}>
              {renderTag()}
            </div>
          ) : (
            <Input placeholder='请输入' disabled={showStatus === 'readOnly'} onClick={() => setVisible(true)} value={fdName} />
          ) : (
            <span>
              {
                Array.isArray(value) ? value.map(item => item.fdName).join(',') : value && value[chooseFdName]
              }
            </span>
          )
        }
      </div>
      <Modal
        visible={visible}
        destroyOnClose={true}
        title={modalTitle}
        mask={true}
        width={'1100px'}
        className='record-modal'
        onCancel={() => handleCancel()}
        onOk={() => handleOk()}
        footer={showFooter ? undefined : null}
      >
        <div className="lui-template-list-table">
          {
            showCriteria ? (
              <Criteria key="criteria" expandable={true} onChange={handleCriteriaChange}>
                {
                  criteriaKey ? criertiaObj[criteriaKey] : null
                }
              </Criteria>
            ) : null
          }

          <Table {...tableProps} onRow={onRowClick} />
        </div>
        <div className="lui-template-list-page">
          {listData.totalSize ? (
            <Pagination
              total={listData.totalSize}
              pageSize={listData.pageSize}
              onChange={handlePage}
            />
          ) : null}
        </div>
      </Modal>
    </React.Fragment >
  )
}

export default XformModal
