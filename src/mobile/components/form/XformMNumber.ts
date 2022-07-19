import { createElement as h } from 'react'
import { CellComponent } from '@ekp-infra/render'

const XformMNumber = (props) => {
  return h(CellComponent, {
    $$id: props.$$id,
    $$componentID: '@elem/xform-m-number',
    $$hideLoading: true,
    ...props
  })
}

export default XformMNumber
