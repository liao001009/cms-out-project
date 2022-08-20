import { fmtMsg } from '@ekp-infra/respect'
/** 模板状态 */
export const templateStatus = [
  { text: fmtMsg(':desc.draft', '草稿'), value: 0 },
  { text: fmtMsg(':button.publish', '发布'), value: 1 },
  { text: fmtMsg(':button.disable', '禁用'), value: 2 }
]

/**模板名称 */
export const templateNameList = [
  // { text: fmtMsg(':desc.bar', '导航模块'), value: 1 },
  { text: fmtMsg(':desc.flow', '流程类'), value: 2 },
  { text: fmtMsg(':desc.official', '公文类'), value: 3 },
  { text: fmtMsg(':desc.infor', '资讯类'), value: 4 },
  { text: fmtMsg(':desc.system', '制度类'), value: 5 },
  // { text: fmtMsg(':desc.schedule', '日程模块'), value: 6 },
  // { text: fmtMsg(':desc.meeting', '会议模块'), value: 7 }

]

export const creatorList = (listData) => {
  const data: any = []
  listData.map(v => {
    if (v.fdStatus === 0) {
      data.push({ text: fmtMsg(':desc.draft', '草稿'), value: '0' })
    } else if (v.fdStatus === 1) {
      data.push({ text: fmtMsg(':button.publish', '发布'), value: 1 })
    } else if (v.fdStatus === 2) {
      data.push({ text: fmtMsg(':button.disable', '禁用'), value: 2 })
    }
    return v
  })
  // 数组对象去重
  const obj = {}
  const peon = data.reduce((cur, next) => {
    obj[next.value] ? '' : obj[next.value] = true && cur.push(next)
    return cur
  }, [])
  return peon
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
  // 'ERROR' = '21',
  /** 流程结束 */
  'COMPLETED' = '30',
  /** 挂起状态 */
  'SUSPENDED' = '21',
  /** 驳回状态 */
  'REJECT' = '11',
  /** 撤回草稿 */
  'WITHDRAW' = '12',
  /** 异常 */
  'EXCEPTION' = '29'
}

/** 文档详情页的状态 */
export const getDocLbpmStatus = (processStatus?: ESysLbpmProcessStatus) => {
  switch (processStatus) {
    case ESysLbpmProcessStatus.SUSPENDED:
      return fmtMsg(':kmReviewMain.fdProcessStatusOptions.suspended', '已挂起')
    case ESysLbpmProcessStatus.DRAFT:
    case ESysLbpmProcessStatus.WITHDRAW:
      return fmtMsg(':kmReviewMain.fdProcessStatusOptions.10', '拟制中')
    case ESysLbpmProcessStatus.REJECT:
      return fmtMsg(':kmReviewMain.fdProcessStatusOptions.11', '被驳回')
    case ESysLbpmProcessStatus.ACTIVATED:
    case ESysLbpmProcessStatus.EXCEPTION:
      return fmtMsg(':kmReviewMain.fdProcessStatusOptions.reviewing', '审核中')
    case ESysLbpmProcessStatus.COMPLETED:
      return fmtMsg(':kmReviewMain.fdProcessStatusOptions.completed', '已通过')
    case ESysLbpmProcessStatus.ABANDONED:
      return fmtMsg(':kmReviewMain.fdProcessStatusOptions.abandoned', '作废')
    default:
      return null
  }
}

/** 默认收取展开按钮依据 */
export const expandStatus = (processStatus?: ESysLbpmProcessStatus) => {
  switch (processStatus) {
    case ESysLbpmProcessStatus.DRAFT:
    case ESysLbpmProcessStatus.WITHDRAW:
    case ESysLbpmProcessStatus.REJECT:
    case ESysLbpmProcessStatus.ACTIVATED:
    case ESysLbpmProcessStatus.EXCEPTION:
      return true
    case ESysLbpmProcessStatus.COMPLETED:
    case ESysLbpmProcessStatus.ABANDONED:
      return false
    default:
      return
  }
}

/** 操作类型 */
export enum EOperationType {
  /** 处理人沟通 */
  'handler_communicate' = 'handler_communicate',
  /** 处理人废弃 */
  'handler_abandon' = 'handler_abandon',
  /** 处理人驳回 */
  'handler_reject' = 'handler_reject',
  /** 处理人通过 */
  'handler_pass' = 'handler_pass',
  /** 处理人转办 */
  'handler_transfer' = 'handler_transfer',
  /** 处理人取消沟通 */
  'handler_cancelCommunicate' = 'handler_cancelCommunicate',
  /** 处理人回复沟通 */
  'handler_replyCommunicate' = 'handler_replyCommunicate',
  /** 处理人传阅 */
  'handler_read' = 'handler_read',
  /** 处理人签字 */
  'handler_sign' = 'handler_sign',
  /** 处理人分发 */
  'handler_assign' = 'handler_assign',
  /** 处理人抄送确认 */
  'handler_sendConfirm' = 'handler_sendConfirm',
  /** 处理人分发确认 */
  'handler_assignConfirm' = 'handler_assignConfirm',
  /** 处理人节点唤醒 */
  'handler_nodeResume' = 'handler_nodeResume',
  /** 投票人同意 */
  'voter_agree' = 'voter_agree',
  /** 投票人不同意 */
  'voter_disagree' = 'voter_disagree',
  /** 投票人弃权 */
  'voter_abstain' = 'voter_abstain',
  /** 处理人节点暂停 */
  'handler_nodeSuspend' = 'handler_nodeSuspend',
  /** 加签 */
  'handler_prependSign' = 'handler_prependSign',
  /** 取消加签 */
  'handler_prependSignCancel' = 'handler_prependSignCancel',
  /** 通过加签 */
  'handler_prependSignPass' = 'handler_prependSignPass',
  /** 退回加签 */
  'handler_prependSignRefuse' = 'handler_prependSignRefuse',
  /** 补签 */
  'handler_appendSign' = 'handler_appendSign',
  /** 起草人废弃 */
  'drafter_abandon' = 'drafter_abandon',
  /** 起草人撤回 */
  'drafter_retract' = 'drafter_retract',
  /** 起草人提交 */
  'drafter_submit' = 'drafter_submit',
  /** 起草人传阅 */
  'drafter_read' = 'drafter_read',
  /** 起草人催办 */
  'drafter_urge' = 'drafter_urge',
  /** 已处理人撤回 */
  'historyHandler_retract' = 'historyHandler_retract',
  /** 已处理人传阅 */
  'historyHandler_read' = 'historyHandler_read',
  /** 已处理人催办 */
  'historyHandler_urge' = 'historyHandler_urge',
  /** 已处理人追加意见 */
  'historyHandler_addOpinion' = 'historyHandler_addOpinion',
  /** 特权人前后跳转 */
  'admin_jump' = 'admin_jump',
  /** 特权人修改当前处理人 */
  'admin_changeCurHandler' = 'admin_changeCurHandler',
  /** 特权人重新激活流程 */
  'admin_retry' = 'admin_retry',
  /** 特权人提前结束 */
  'admin_end' = 'admin_end',
  /** 特权人废弃 */
  'admin_abandon' = 'admin_abandon',
  /** 特权人修改流程图 */
  'admin_modifyProcess' = 'admin_modifyProcess',
  /** 特权人流程暂停 */
  'admin_processSuspend' = 'admin_processSuspend',
  /** 特权人流程唤醒 */
  'admin_processResume' = 'admin_processResume',
  /** 特权人节点暂停 */
  'admin_nodeSuspend' = 'admin_nodeSuspend',
  /** 特权人节点唤醒 */
  'admin_nodeResume' = 'admin_nodeResume',
  /** 特权人版本切换 */
  'admin_modifyProcessVersion' = 'admin_modifyProcessVersion',
  /** 传阅 */
  'circulate' = 'circulate',
  /** 当前处理人传阅 */
  'handler_circulation' = 'handler_circulation',
  /** 历史处理人传阅 */
  'historyHandler_circulation' = 'historyHandler_circulation',
  /** 起草人传阅 */
  'drafter_circulation' = 'drafter_circulation',
  /** 传阅阅知 */
  'circulation_reply' = 'circulation_reply',
  /** 协同 */
  'drafter_cooperate' = 'drafter_cooperate',
  /** 回复协同 */
  'handler_replyDraftCooperate' = 'handler_replyDraftCooperate',
  /** 取消协同 */
  'drafter_cancelDraftCooperate' = 'drafter_cancelDraftCooperate',
}


/** 检查是否传阅操作 */
export const checkIsCirculate = (type: EOperationType) => {
  return [
    EOperationType.circulate,
    EOperationType.handler_circulation,
    EOperationType.historyHandler_circulation,
    EOperationType.drafter_circulation,
  ].includes(type)
}

export enum EShowStatus {
  /** 查看 */
  'view' = 'view',
  /** 编辑 */
  'edit' = 'edit',
  /** 添加 */
  'add' = 'add',
  /** 只读 */
  'readOnly' = 'readOnly',
  /** 禁用 */
  'disabled' = 'disabled'
}
