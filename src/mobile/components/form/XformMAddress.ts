import { createElement as h } from 'react'
import { CellComponent } from '@ekp-infra/render'

const XformMAddress = (props) => {
  return h(CellComponent, {
    $$id: props.$$id,
    $$componentID: '@elem/xform-m-address',
    $$hideLoading: true,
    ...props
  })
}

export default XformMAddress
