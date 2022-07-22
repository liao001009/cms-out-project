import authApi from '@/api/sysAuth'
import message from '@antd/message'


export function processStatus (statusEnum: string) {
  switch (statusEnum) {
    case '00':
      return '废弃'
    case '01':
      return '草稿'
    case '10':
      return '暂存草稿'
    case '11':
      return '驳回'
    case '12':
      return '撤回草稿'
    case '20':
      return '待审'
    case '21':
      return '挂起'
    case '29':
      return '异常'
    case '30':
      return '结束'
    case '31':
      return '否决'
    default:
      return ''
  }
}

export const creatorList = (listData) => {
  if (!listData) return undefined
  const arr = listData.map(item => (
    {
      text: (item.fdCreator && item.fdCreator.fdName) || '无',
      value: (item.fdCreator && item.fdCreator.fdId) || ''
    }
  ))
  const res = new Map()
  return arr.filter((arr) => !res.has(arr.value) && res.set(arr.value, 1) && arr.value !== '')
}

export const processorList = (listData) => {
  if (!listData) return undefined
  const arr = listData.map(item => (
    {
      text: (item.lbpm_current_processor && item.lbpm_current_processor.currentHandlerNames) || '无',
      value: (item.lbpm_current_processor && item.lbpm_current_processor.currentHandlerIds) || ''
    }
  ))
  const res = new Map()
  return arr.filter((arr) => !res.has(arr.value) && res.set(arr.value, 1) && arr.value !== '')
}

export const lastHandlerList = (listData) => {
  if (!listData) return undefined
  const arr = listData.map(item => (
    {
      text: (item.lbpm_last_handler && item.lbpm_last_handler.lastHandlerName) || '无',
      value: (item.lbpm_last_handler &&item.lbpm_last_handler.lastHandlerId) || ''
    }
  ))
  const res = new Map()
  return arr.filter((arr) => !res.has(arr.value) && res.set(arr.value, 1) && arr.value !== '')
}

const processStatusList = [
  { status: '00', text: '废弃', style: 'end' },
  { status: '10', text: '草稿', style: 'draft' },
  { status: '11', text: '驳回', style: 'reject' },
  { status: '12', text: '撤回草稿', style: 'draft' },
  { status: '20', text: '待审', style: 'peding' },
  { status: '21', text: '挂起', style: 'hand' },
  { status: '29', text: '异常', style: 'reject' },
  { status: '30', text: '结束', style: 'end' },
  { status: '31', text: '否决', style: 'end' }
]
export const getProcessStatus = (status: string) => {
  return processStatusList.find(item => item.status === status)
}

export enum ESysLbpmProcessStatus {
  /** 废弃状态 */
  'ABANDONED' = '00',
  /** 流程创建（新建未提交） */
  'CREATED' = '01',
  /** 流程草稿 （暂存为草稿） */
  'DRAFT' = '10',
  /** 流转中 */
  'ACTIVATED' = '20',
  /** 流程出错 */
  'ERROR' = '21',
  /** 流程结束 */
  'COMPLETED' = '30',
  /** 挂起状态 */
  'SUSPENDED' = '40',
  /** 驳回状态 */
  'REJECT' = '11',
  /** 撤回草稿 */
  'WITHDRAW' = '12'
}

/** 是否为流程相关处理人 */
export const isFlowTaskRole = (flowData) => {
  const taskRoles = getTaskRoles(flowData && flowData.identity)
  return taskRoles.indexOf('admin') > -1
    || taskRoles.indexOf('handler') > -1
    || taskRoles.indexOf('drafter') > -1
    || taskRoles.indexOf('historyHandler') > -1
}

/** 获取当前人身份 */
export const getTaskRoles = (identity) => {
  const taskRoles: string[] = []
  if (!identity) {
    return taskRoles
  }
  // 起草人
  if (identity.drafter && identity.drafter.length > 0) {
    isExistOperation(identity.drafter) && taskRoles.push('drafter')
  }
  // 特权人
  if (identity.admin && identity.admin.length > 0) {
    isExistOperation(identity.admin) && taskRoles.push('admin')
  }
  // 审批人
  if (identity.handler && identity.handler.length > 0) {
    isExistOperation(identity.handler) && taskRoles.push('handler')
  }
  // 历史处理人
  if (identity.historyHandler && identity.historyHandler.length > 0) {
    isExistOperation(identity.historyHandler) && taskRoles.push('historyHandler')
  }
  return taskRoles
}

// 判断是否具有操作权限
export const isExistOperation = (handler) => {
  let isOpt = false
  handler.map((item) => {
    if (item.operations.length > 0) {
      isOpt = true
    }
  })
  return isOpt
}

/** 获取流程状态 */
export const getFlowStatus = (flowData) => {
  return flowData.processStatus
}

/** 是否为流程特权人 */
export const isFlowAdminRole = (flowData) => {
  const taskRoles = getTaskRoles(flowData && flowData.identity)
  return taskRoles.includes('admin')
}

/** 角色控制 只要有一个true即可 */
export const roleAuthCheck = async (checkArr: Array<any>) => {
  const res = await authApi.roleCheck(checkArr)
  const _keys = Object.keys(res.data)
  const role = _keys.some(key => res.data[key])
  return role
}

export const getUrlParameter = (url, param) => {
  // @ts-ignore
  const re = new RegExp()
  // @ts-ignore
  re.compile('[\\?&]'+param+'=([^(&|#)]*)', 'i')
  const arr = re.exec(url)
  if(arr==null) {
    return null
  }
  return decodeURIComponent(arr[1])
}



export const showHTTPErrorMessage = (err, cb?: any) => {
  if (err.response && err.response.data) {
    const {
      msg
      // code
    } = err.response.data

    if (msg) {
      message.error(msg.replace('[]', ''), 2, cb)
    } else {
      // DO NOTHING
    }

    return
  }

  message.error(err.message.replace('[]', ''), 2, cb)
}

/**
 *  流程管理_默认权限 : ROLE_KMREVIEW_DEFAULT
    流程管理_类别维护人员 : ROLE_KMREVIEW_CATEGORY_ADMIN
    流程管理_管理员 : ROLE_KMREVIEW_ADMIN
    流程管理_后台管理 : ROLE_KMREVIEW_BACKSTAGE_MANAGER
    流程管理_高级设置 : ROLE_KMREVIEW_ADVANCED_SETTING
    流程管理_创建文档 : ROLE_KMREVIEW_MAIN_CREATE
    流程管理_阅读文档 : ROLE_KMREVIEW_MAIN_READER
    流程管理_编辑文档 : ROLE_KMREVIEW_MAIN_UPDATE
    流程管理_删除文档 : ROLE_KMREVIEW_MAIN_DELETE
    流程管理_查看所有流程模板 : ROLE_KMREVIEW_TEMPLATE_VIEW
 */
