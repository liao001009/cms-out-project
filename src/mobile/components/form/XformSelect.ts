import { createElement as h } from 'react'
import { CellComponent } from '@ekp-infra/render'

const XformSelect = (props) => {
  return h(CellComponent, {
    $$id: props.$$id,
    $$componentID: '@elem/xform-select',
    $$hideLoading: true,
    ...props
  })
}

export default XformSelect
