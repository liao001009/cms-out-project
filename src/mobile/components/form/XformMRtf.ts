import { createElement as h } from 'react'
import { CellComponent } from '@ekp-infra/render'

const XformMRtf = (props) => {
  return h(CellComponent, {
    $$id: props.$$id,
    $$componentID: '@elem/xform-m-rtf',
    $$hideLoading: true,
    ...props
  })
}

export default XformMRtf
