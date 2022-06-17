import { createElement as h } from 'react'
import { CellComponent } from '@ekp-infra/render'

const GridItem = (props) => {
  return h(CellComponent, {
    $$id: props.$$id,
    $$componentID: '@elem/layout-grid.GridItem',
    $$hideLoading: true,
    ...props
  })
}

export default GridItem
