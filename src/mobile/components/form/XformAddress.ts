import { createElement as h } from 'react'
import { CellComponent } from '@ekp-infra/render'

const XformAddress = (props) => {
  return h(CellComponent, {
    $$id: props.$$id,
    $$componentID: '@elem/xform-address',
    $$hideLoading: true,
    ...props
  })
}

export default XformAddress
