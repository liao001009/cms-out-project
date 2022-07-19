import { createElement as h } from 'react'
import { CellComponent } from '@ekp-infra/render'

const XformMDatetime = (props) => {
  return h(CellComponent, {
    $$id: props.$$id,
    $$componentID: '@elem/xform-m-datetime',
    $$hideLoading: true,
    ...props
  })
}

export default XformMDatetime
