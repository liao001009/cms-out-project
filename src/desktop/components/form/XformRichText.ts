import { createElement as h } from 'react'
import { CellComponent } from '@ekp-infra/render'

const XformRichText = (props) => {
  return h(CellComponent, {
    $$id: props.$$id,
    $$componentID: '@elem/xform-rich-text',
    $$hideLoading: true,
    ...props
  })
}

export default XformRichText
