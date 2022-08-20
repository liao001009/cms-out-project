import { createElement as h } from 'react'
import { CellComponent } from '@ekp-infra/render'

const XformMAttach = (props) => {
  return h(CellComponent, {
    $$id: props.$$id,
    $$componentID: '@elem/xform-m-attach',
    $$hideLoading: true,
    ...props
  })
}

export default XformMAttach
