import { createElement as h } from 'react'
import { CellComponent } from '@ekp-infra/render'

const XformMoney = (props) => {
  return h(CellComponent, {
    $$id: props.$$id,
    $$componentID: '@elem/xform-money',
    $$hideLoading: true,
    ...props
  })
}

export default XformMoney
