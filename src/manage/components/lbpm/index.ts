// 流程设计器
import React, { createElement as h } from 'react'
import { Module } from '@ekp-infra/common'
import { Loading } from '@lui/core'

const LBPMEditFragment = Module.getComponent('sys-lbpm', 'LBPMEditFragment', {
  loading: h(Loading)
})

export interface IProps {
  /** 模板id */
  id: string
}

const LBPMEditor: React.FC<IProps> = (props) => {
  return h(LBPMEditFragment, {
    ...props,
    moduleCode: 'cms-out-project',
    integrateMode: 'third',
    displayMode: 'edit',
    formId: props.id,
    innerForm: [
      {
        fdSystemCode: 'INNER_SYSTEM', // 系统标示
        fdModuleCode: 'cms-out-project' // 模块标识
      }
    ]
  })
}

export default LBPMEditor
