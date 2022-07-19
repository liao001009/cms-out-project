import { createElement as h } from 'react'
import { CellComponent } from '@ekp-infra/render'

const XformNumber = (props) => {
  return h(CellComponent, {
    $$id: props.$$id,
    $$componentID: '@elem/xform-number',
    $$hideLoading: true,
    ...props
  })
}

export default XformNumber
