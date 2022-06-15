import { createElement as h } from 'react'
import { CellComponent } from '@ekp-infra/render'

const XformDatetime = (props) => {
  return h(CellComponent, {
    $$id: props.$$id,
    $$componentID: '@elem/xform-datetime',
    $$hideLoading: true,
    ...props
  })
}

export default XformDatetime
