import { createElement as h } from 'react'
import { CellComponent } from '@ekp-infra/render'

const XformMDetailTable = (props) => {
  return h(CellComponent, {
    $$id: props.$$id,
    $$componentID: '@elem/xform-m-detail-table',
    $$hideLoading: true,
    ...props
  })
}

export default XformMDetailTable
