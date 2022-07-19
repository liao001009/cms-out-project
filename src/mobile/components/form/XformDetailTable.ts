import { createElement as h } from 'react'
import { CellComponent } from '@ekp-infra/render'

const XformDetailTable = (props) => {
  return h(CellComponent, {
    $$id: props.$$id,
    $$componentID: '@elem/xform-detail-table',
    $$hideLoading: true,
    ...props
  })
}

export default XformDetailTable
