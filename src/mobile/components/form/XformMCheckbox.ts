import { createElement as h } from 'react'
import { CellComponent } from '@ekp-infra/render'

const XformMCheckbox = (props) => {
  return h(CellComponent, {
    $$id: props.$$id,
    $$componentID: '@elem/xform-m-checkbox',
    $$hideLoading: true,
    ...props
  })
}

export default XformMCheckbox
