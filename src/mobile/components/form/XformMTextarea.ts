import { createElement as h } from 'react'
import { CellComponent } from '@ekp-infra/render'

const XformMTextarea = (props) => {
  return h(CellComponent, {
    $$id: props.$$id,
    $$componentID: '@elem/xform-m-textarea',
    $$hideLoading: true,
    ...props
  })
}

export default XformMTextarea
