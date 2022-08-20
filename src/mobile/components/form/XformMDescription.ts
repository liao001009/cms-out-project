import { createElement as h } from 'react'
import { CellComponent } from '@ekp-infra/render'

const XformMDescription = (props) => {
  return h(CellComponent, {
    $$id: props.$$id,
    $$componentID: '@elem/xform-m-description',
    $$hideLoading: true,
    ...props
  })
}

export default XformMDescription
