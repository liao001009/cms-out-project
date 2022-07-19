import { createElement as h } from 'react'
import { CellComponent } from '@ekp-infra/render'

const XformMRelation = (props) => {
  return h(CellComponent, {
    $$id: props.$$id,
    $$componentID: '@elem/xform-m-relation',
    $$hideLoading: true,
    ...props
  })
}

export default XformMRelation
