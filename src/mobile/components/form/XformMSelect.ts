import { createElement as h } from 'react'
import { CellComponent } from '@ekp-infra/render'

const XformMSelect = (props) => {
  return h(CellComponent, {
    $$id: props.$$id,
    $$componentID: '@elem/xform-m-select',
    $$hideLoading: true,
    ...props
  })
}

export default XformMSelect
