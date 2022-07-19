import { createElement as h } from 'react'
import { CellComponent } from '@ekp-infra/render'

const XformDescription = (props) => {
  return h(CellComponent, {
    $$id: props.$$id,
    $$componentID: '@elem/xform-description',
    $$hideLoading: true,
    ...props
  })
}

export default XformDescription
