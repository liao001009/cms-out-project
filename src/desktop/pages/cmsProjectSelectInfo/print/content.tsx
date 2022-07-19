import React from 'react'
import { IContentViewProps } from '@ekp-runtime/module'
import { Module } from '@ekp-infra/common'
import Form from '../view/form'

const PrintFragment = Module.getComponent('sys-mech-print', 'PrintFragment', {
  loading: <React.Fragment></React.Fragment>
})

const Content: React.FC<IContentViewProps> = (props) => {
  return <PrintFragment {...props} mainSolt={Form} />
}

export default Content
