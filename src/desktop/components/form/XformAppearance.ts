import { createElement as h } from 'react'
import { CellComponent } from '@ekp-infra/render'

const XformAppearance = (props) => {
  return h(CellComponent, {
    $$id: props.$$id,
    $$componentID: '@elem/xform-appearance',
    $$hideLoading: true,
    ...props
  })
}

export default XformAppearance
