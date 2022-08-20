import { createElement as h } from 'react'
import { CellComponent } from '@ekp-infra/render'

const XformCheckbox = (props) => {
  return h(CellComponent, {
    $$id: props.$$id,
    $$componentID: '@elem/xform-checkbox',
    $$hideLoading: true,
    ...props
  })
}

export default XformCheckbox
