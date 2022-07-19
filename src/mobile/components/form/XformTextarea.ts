import { createElement as h } from 'react'
import { CellComponent } from '@ekp-infra/render'

const XformTextarea = (props) => {
  return h(CellComponent, {
    $$id: props.$$id,
    $$componentID: '@elem/xform-textarea',
    $$hideLoading: true,
    ...props
  })
}

export default XformTextarea
