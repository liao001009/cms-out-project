import { createElement as h } from 'react'
import { CellComponent } from '@ekp-infra/render'

const XformRadio = (props) => {
  return h(CellComponent, {
    $$id: props.$$id,
    $$componentID: '@elem/xform-radio',
    $$hideLoading: true,
    ...props
  })
}

export default XformRadio
