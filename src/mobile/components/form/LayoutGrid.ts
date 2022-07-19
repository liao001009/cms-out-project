import { createElement as h } from 'react'
import { CellComponent } from '@ekp-infra/render'

const LayoutGrid = (props) => {
  return h(CellComponent, {
    $$id: props.$$id,
    $$componentID: '@elem/layout-grid',
    $$hideLoading: true,
    ...props
  })
}

export default LayoutGrid
