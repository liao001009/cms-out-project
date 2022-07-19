import { createElement as h } from 'react'
import { CellComponent } from '@ekp-infra/render'

const XformInput = (props) => {
  return h(CellComponent, {
    $$id: props.$$id,
    $$componentID: '@elem/xform-input',
    $$hideLoading: true,
    ...props
  })
}

export default XformInput
