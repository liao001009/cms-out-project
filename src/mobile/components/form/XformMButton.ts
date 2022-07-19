import { createElement as h } from 'react'
import { CellComponent } from '@ekp-infra/render'

const XformMButton = (props) => {
  return h(CellComponent, {
    $$id: props.$$id,
    $$componentID: '@elem/xform-m-button',
    $$hideLoading: true,
    ...props
  })
}

export default XformMButton
