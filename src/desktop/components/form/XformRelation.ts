import { createElement as h } from 'react'
import { CellComponent } from '@ekp-infra/render'

const XformRelation = (props) => {
  return h(CellComponent, {
    $$id: props.$$id,
    $$componentID: '@elem/xform-relation',
    $$hideLoading: true,
    ...props
  })
}

export default XformRelation
