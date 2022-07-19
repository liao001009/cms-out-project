import { createElement as h } from 'react'
import { CellComponent } from '@ekp-infra/render'

const XformButton = (props) => {
  return h(CellComponent, {
    $$id: props.$$id,
    $$componentID: '@elem/xform-button',
    $$hideLoading: true,
    ...props
  })
}

export default XformButton
