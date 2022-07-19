import { createElement as h } from 'react'
import { CellComponent } from '@ekp-infra/render'

const XformMRadio = (props) => {
  return h(CellComponent, {
    $$id: props.$$id,
    $$componentID: '@elem/xform-m-radio',
    $$hideLoading: true,
    ...props
  })
}

export default XformMRadio
